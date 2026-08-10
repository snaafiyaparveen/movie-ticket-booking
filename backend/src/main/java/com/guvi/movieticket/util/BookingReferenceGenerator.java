package com.guvi.movieticket.util;

import java.security.SecureRandom;

public final class BookingReferenceGenerator {

    private static final String CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    private BookingReferenceGenerator() {}

    public static String generate() {
        StringBuilder sb = new StringBuilder("MTB-");
        for (int i = 0; i < 8; i++) {
            sb.append(CHARS.charAt(RANDOM.nextInt(CHARS.length())));
        }
        return sb.toString();
    }
}
