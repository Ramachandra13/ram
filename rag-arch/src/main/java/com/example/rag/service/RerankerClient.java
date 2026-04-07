package com.example.rag.service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.example.rag.model.DocumentChunk;
import com.example.rag.model.RerankResponse;

@Component
public class RerankerClient {


    private static final Logger log =
            LoggerFactory.getLogger(RerankerClient.class);

//    @Value("${cross.encoder.reranker.url}")
//    String RERANKER_URL; // local cross-encoder service
    private static final String RERANKER_URL = "http://localhost:8001";

    private final RestTemplate restTemplate = new RestTemplate();


//    public List<DocumentChunk> rerank(
//            String query,
//            List<DocumentChunk> chunks) {
//
//        // Call cross-encoder reranker
//        return chunks;
//    }

    public List<DocumentChunk> rerank(
            String query,
            List<DocumentChunk> chunks) {

        if (chunks == null || chunks.isEmpty()) {
            log.info("RerankerClient :: No chunks to rerank");
            return List.of();
        }

        log.info("RerankerClient :: Sending {} chunks for reranking",
                chunks.size());

        // ---- Build request payload ----
        Map<String, Object> request = Map.of(
                "query", query,
                "documents", chunks.stream()
                        .map(chunk -> Map.of(
                                "id", chunk.getId(),
                                "text", chunk.getContent()
                        ))
                        .collect(Collectors.toList())
        );

        // ---- Call cross-encoder reranker ----
        log.info("RerankerClient:: Reranker URL", RERANKER_URL);

        RerankResponse response =
                restTemplate.postForObject(
                        RERANKER_URL+"/rerank",
                        request,
                        RerankResponse.class);

        if (response == null || response.getResults() == null) {
            log.warn("RerankerClient :: Empty rerank response");
            return chunks;
        }

        // ---- Map scores back to chunks ----
        Map<String, Double> scoreMap =
                response.getResults().stream()
                        .collect(Collectors.toMap(
                                RerankResult::getId,
                                RerankResult::getScore
                        ));

        chunks.forEach(chunk ->
                chunk.setScore(
                        scoreMap.getOrDefault(chunk.getId(), 0.0)
                )
        );
        log.info("RerankerClient :: Before send rresponse");
        // ---- Sort by relevance score ----
        return chunks.stream()
                .sorted(Comparator.comparingDouble(
                        DocumentChunk::getScore).reversed()).limit(5)
                .collect(Collectors.toList());
    }

}
