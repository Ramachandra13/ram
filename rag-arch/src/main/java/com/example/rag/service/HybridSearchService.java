package com.example.rag.service;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.rag.model.DocumentChunk;
import com.example.rag.vector.VectorStoreClient;

@Service
public class HybridSearchService {

    private static final long HYBRID_TOP_K = 20;
    private final EmbeddingClient embeddingClient;
    private final VectorStoreClient vectorStoreClient;
    private final IKeywordSearchService keywordSearchService;
    private final RerankerClient rerankerClient;

    private final QueryIntentDetector intentDetector;
    private final HybridWeightResolver weightResolver;

    private static final double DENSE_WEIGHT = 0.6;
    private static final double SPARSE_WEIGHT = 0.4;

    public HybridSearchService(
            EmbeddingClient embeddingClient,
            VectorStoreClient vectorStoreClient,
            IKeywordSearchService keywordSearchService,
            RerankerClient rerankerClient,
            QueryIntentDetector intentDetector,
            HybridWeightResolver weightResolver
    ) {
        this.embeddingClient = embeddingClient;
        this.vectorStoreClient = vectorStoreClient;
        this.keywordSearchService = keywordSearchService;
        this.rerankerClient = rerankerClient;
        this.intentDetector = intentDetector;
        this.weightResolver = weightResolver;
    }

    public List<DocumentChunk> search(String query) {


        QueryIntent intent =
                intentDetector.detect(query);

        HybridWeightResolver.HybridWeights weights =
                weightResolver.resolve(intent);

        float[] embedding =
                embeddingClient.embed(query);

        List<DocumentChunk> denseResults =
                vectorStoreClient.vectorSearch(embedding);

        List<DocumentChunk> sparseResults =
                keywordSearchService.search(query, 20);

        List<DocumentChunk> hybridResults =
                mergeDenseAndSparse(
                        denseResults,
                        sparseResults,
                        weights
                );

        return rerankerClient.rerank(query, hybridResults);

    }

    private List<DocumentChunk> mergeDenseAndSparse(
            List<DocumentChunk> denseResults,
            List<DocumentChunk> sparseResults,
            HybridWeightResolver.HybridWeights weights) {

        normalizeScores(denseResults);
        normalizeScores(sparseResults);

        Map<String, DocumentChunk> merged = new HashMap<>();

        for (DocumentChunk chunk : denseResults) {
            chunk.setScore(chunk.getScore() * weights.denseWeight());
            merged.put(chunk.getId(), chunk);
        }

        for (DocumentChunk chunk : sparseResults) {
            double weightedSparseScore =
                    chunk.getScore() * weights.sparseWeight();

            merged.merge(
                    chunk.getId(),
                    chunk,
                    (existing, incoming) -> {
                        existing.setScore(
                                existing.getScore() + weightedSparseScore);
                        return existing;
                    }
            );
        }

        return merged.values().stream()
                .sorted(Comparator
                        .comparingDouble(DocumentChunk::getScore)
                        .reversed())
                .limit(HYBRID_TOP_K)
                .toList();
    }

    private void normalizeScores(List<DocumentChunk> chunks) {

        if (chunks == null || chunks.isEmpty()) return;

        double maxScore = chunks.stream()
                .mapToDouble(DocumentChunk::getScore)
                .max()
                .orElse(1.0);

        if (maxScore == 0) return;

        chunks.forEach(chunk ->
                chunk.setScore(chunk.getScore() / maxScore)
        );
    }
}
