package com.example.rag.service;

import java.util.*;
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

    private static final String RERANKER_URL = "http://localhost:8001";

    private final RestTemplate restTemplate = new RestTemplate();

    public List<DocumentChunk> rerank(
            String query,
            List<DocumentChunk> chunks) {

        if (chunks == null || chunks.isEmpty()) {
            log.info("RerankerClient :: No chunks to rerank");
            return List.of();
        }

        log.info("RerankerClient :: Sending {} chunks for reranking", chunks.size());


        // ---- Log incoming chunks ----
        chunks.forEach(chunk ->
                log.debug("Rerank chunk -> id={}, textPresent={}, score={}",
                        chunk.getId(),
                        chunk.getText() != null,
                        chunk.getScore())
        );

        // ---- Filter invalid chunks ----
        List<DocumentChunk> validChunks = chunks.stream()
                .filter(c -> c.getText() != null && !c.getText().isBlank())
                .toList();

        if (validChunks.isEmpty()) {
            log.warn("RerankerClient :: No valid chunks after filtering");
            return chunks;
        }

        // ---- Build request payload ----

        Map<String, Object> request = new HashMap<>();
        request.put("query", query);

        List<Map<String, Object>> documents = validChunks.stream()
                .map(chunk -> {
                    Map<String, Object> doc = new HashMap<>();
                    doc.put("id", chunk.getId());
                    doc.put("text", chunk.getText());
                    return doc;
                })
                .toList();

        request.put("documents", documents);

        log.info("RerankerClient :: Calling reranker at {}", RERANKER_URL);


        // ---- Call cross-encoder reranker ----
        RerankResponse response;
        try {
            response = restTemplate.postForObject(
                    RERANKER_URL + "/rerank",
                    request,
                    RerankResponse.class
            );
        } catch (Exception ex) {
            log.error("RerankerClient :: Reranker call failed, returning vector-ranked chunks", ex);
            return chunks;
        }

        if (response == null || response.getResults() == null || response.getResults().isEmpty()) {
            log.warn("RerankerClient :: Empty rerank response");
            return chunks;
        }

        // ---- Map rerank scores back to chunks ----
        Map<String, Double> scoreMap = response.getResults().stream()
                .collect(Collectors.toMap(
                        RerankResult::getId,
                        RerankResult::getScore
                ));

        chunks.forEach(chunk ->
                chunk.setScore(scoreMap.getOrDefault(chunk.getId(), 0.0))
        );

        // ---- Sort by rerank score and return top 5 ----
        return chunks.stream()
                .sorted(Comparator.comparingDouble(DocumentChunk::getScore).reversed())
                .limit(5)
                .toList();
    }

}
