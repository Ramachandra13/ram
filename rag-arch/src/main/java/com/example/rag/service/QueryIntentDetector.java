package com.example.rag.service;

import java.util.regex.Pattern;

import org.springframework.stereotype.Component;

@Component
public class QueryIntentDetector {

    private static final Pattern CODE_PATTERN =
            Pattern.compile("(?i)\\b(error|exception|status|code|http|\\d{3})\\b");

    public QueryIntent detect(String query) {

        int wordCount = query.trim().split("\\s+").length;

        // Short + technical = keyword heavy
        if (wordCount <= 4 || CODE_PATTERN.matcher(query).find()) {
            return QueryIntent.KEYWORD_HEAVY;
        }

        // Long natural language question = semantic heavy
        if (wordCount >= 8) {
            return QueryIntent.SEMANTIC_HEAVY;
        }

        return QueryIntent.MIXED;
    }
}
