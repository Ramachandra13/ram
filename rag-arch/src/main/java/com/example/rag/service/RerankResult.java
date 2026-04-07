package com.example.rag.service;

public class RerankResult {

    private String id;
    private double score;

    public String getId() {
        return id;
    }

    public double getScore() {
        return score;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setScore(double score) {
        this.score = score;
    }
}
