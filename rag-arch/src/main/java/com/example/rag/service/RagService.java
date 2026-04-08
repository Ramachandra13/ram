package com.example.rag.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.example.rag.model.DocumentChunk;
import com.example.rag.vector.VectorStoreClient;

@Service
public class RagService {

    private static final Logger log =
            LoggerFactory.getLogger(RagService.class);

    private final EmbeddingClient embeddingClient;
    private final VectorStoreClient vectorStore;
    private final RerankerClient reranker;

    private final HybridSearchService hybridSearchService;

    public RagService(
            EmbeddingClient embeddingClient,
            VectorStoreClient vectorStore,
            RerankerClient reranker,
            HybridSearchService hybridSearchService
    ) {
        this.embeddingClient = embeddingClient;
        this.vectorStore = vectorStore;
        this.reranker = reranker;
        this.hybridSearchService = hybridSearchService;
    }

    public List<DocumentChunk> retrieveContext(String question) {

        if (question == null || question.isBlank()) {
            log.info("Empty query received, skipping retrieval");
            return List.of();
        }

        log.info("RagService:: Generating query embedding");

        float[] queryEmbedding =
                embeddingClient.embed(question);

        log.info("RagService:: Performing vector search");

        List<DocumentChunk> retrieved =
                vectorStore.vectorSearch(queryEmbedding);

        log.info("RagService:: Reranking {} retrieved chunks",
                retrieved.size());

        List<DocumentChunk> reranker_resp = reranker.rerank(question, retrieved);

        for(DocumentChunk reranker_chunk: reranker_resp){

            log.info(
                    "RagService :: Chunk Score after rerank :: {} :: {}",
                    reranker_chunk.getId(),
                    reranker_chunk.getScore()
            );
        }
        return reranker_resp;
    }


    public List<DocumentChunk> retrieveHybridContext(String question) {

        if (question == null || question.isBlank()) {
            log.info("Empty query received, skipping retrieval");
            return List.of();
        }

        log.info("RagService :: Executing hybrid RAG retrieval");

        List<DocumentChunk> results =
                hybridSearchService.search(question);

        results.forEach(chunk ->
                log.info(
                        "Final Chunk :: id={}, score={}",
                        chunk.getId(),
                        chunk.getScore()
                )
        );
        return results;
    }

}
