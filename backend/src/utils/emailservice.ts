import axios from "axios";

export const emailService = {
  async sendTransacEmail(options: any) {
    const apiKey = process.env.BREVO_API_KEY || "";
    
    if (!apiKey) {
      throw new Error("BREVO_API_KEY is not configured in .env");
    }

    try {
      const response = await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: options.sender,
          to: options.to,
          subject: options.subject,
          htmlContent: options.htmlContent,
          textContent: options.textContent,
        },
        {
          headers: {
            "api-key": apiKey,
            "Content-Type": "application/json",
            "accept": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message;
      throw new Error(`Email Failed: ${errorMsg}`);
    }
  }
};
