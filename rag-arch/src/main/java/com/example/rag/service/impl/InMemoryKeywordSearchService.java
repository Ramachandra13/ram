package com.example.rag.service.impl;

import java.util.Comparator;
import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;

import com.example.rag.model.DocumentChunk;
import com.example.rag.service.IKeywordSearchService;

@Service
public class InMemoryKeywordSearchService
        implements IKeywordSearchService {

    private final List<DocumentChunk> corpus;

    public InMemoryKeywordSearchService(
            List<DocumentChunk> corpus) {
        this.corpus = corpus;
    }

    @Override
    public List<DocumentChunk> search(String query, int topK) {

        String normalizedQuery =
                query.toLowerCase(Locale.ROOT);

        return corpus.stream()
                .peek(chunk -> {
                    long matches = countMatches(
                            normalizedQuery,
                            chunk.getContent().toLowerCase());
                    chunk.setScore(matches);
                })
                .filter(chunk -> chunk.getScore() > 0)
                .sorted(Comparator.comparingDouble(
                        DocumentChunk::getScore).reversed())
                .limit(topK)
                .toList();
    }

    private long countMatches(String query, String text) {
        return List.of(query.split("\\s+")).stream()
                .filter(text::contains)
                .count();
    }
}
