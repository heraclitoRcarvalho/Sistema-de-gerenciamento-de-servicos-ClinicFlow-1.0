package com.clinic;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;

public class WhatsAppService {

    private static final String INSTANCE_ID = "instance122972";
    private static final String TOKEN = "tnfbnkve0uc4x6lv";

    public static void sendWhatsAppMessage(String telefone, String mensagem) {
        try {
            String apiUrl = "https://api.ultramsg.com/" + INSTANCE_ID + "/messages/chat";
            URL url = new URL(apiUrl);
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("POST");
            con.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            con.setDoOutput(true);

            String payload = "token=" + URLEncoder.encode(TOKEN, "UTF-8")
                    + "&to=" + URLEncoder.encode(telefone, "UTF-8")
                    + "&body=" + URLEncoder.encode(mensagem, "UTF-8");

            try (OutputStream os = con.getOutputStream()) {
                byte[] input = payload.getBytes("UTF-8");
                os.write(input, 0, input.length);
            }

            int responseCode = con.getResponseCode();
            System.out.println("Mensagem WhatsApp enviada. Código resposta: " + responseCode);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
