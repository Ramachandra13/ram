package com.example.rag.service;

import java.util.List;

import com.example.rag.model.DocumentChunk;

public interface IKeywordSearchService {
    List<DocumentChunk> search(String query, int topK);

}
