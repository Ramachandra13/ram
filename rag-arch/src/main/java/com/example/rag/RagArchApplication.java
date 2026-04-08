package com.example.rag;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class RagArchApplication {

	public static void main(String[] args) {
		SpringApplication.run(RagArchApplication.class, args);
	}

}
