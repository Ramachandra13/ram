package com.example.rag.service;

import org.springframework.stereotype.Component;

@Component
public class HybridWeightResolver {

    public HybridWeights resolve(QueryIntent intent) {

        return switch (intent) {
            case KEYWORD_HEAVY ->
                    new HybridWeights(0.3, 0.7);
            case SEMANTIC_HEAVY ->
                    new HybridWeights(0.7, 0.3);
            default ->
                    new HybridWeights(0.6, 0.4);
        };
    }

    public record HybridWeights(
            double denseWeight,
            double sparseWeight) {}
}
