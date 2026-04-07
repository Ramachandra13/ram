package com.example.rag.model;

import java.util.List;
import java.util.Map;

public class ChatCompletionRequest {

    private String model;
    private List<Map<String, String>> messages;
    private double temperature;

    private Integer num_ctx;
    private Integer num_predict;


    public ChatCompletionRequest(
            String model,
            List<Map<String, String>> messages,
            double temperature
    ) {
        this.model = model;
        this.messages = messages;
        this.temperature = temperature;
    }

    public String getModel() {
        return model;
    }

    public List<Map<String, String>> getMessages() {
        return messages;
    }

    public double getTemperature() {
        return temperature;
    }

    public Integer getNum_predict() {
        return num_predict;
    }

    public void setNum_predict(Integer num_predict) {
        this.num_predict = num_predict;
    }

    public Integer getNum_ctx() {
        return num_ctx;
    }

    public void setNum_ctx(Integer num_ctx) {
        this.num_ctx = num_ctx;
    }
}
