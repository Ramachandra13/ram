package com.example.rag.model;

import java.util.List;

import com.example.rag.service.RerankResult;

public class RerankResponse {

    private List<RerankResult> results;

    public List<RerankResult> getResults() {
        return results;
    }

    public void setResults(List<RerankResult> results) {
        this.results = results;
    }
}
