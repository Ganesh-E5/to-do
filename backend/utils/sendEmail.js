import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, text) => {
    try {
        const { data, error } = await resend.emails.send({
            from: "TaskFlow <onboarding@resend.dev>",
            to,
            subject,
            text,
        });

        if (error) {
            console.error("Email sending failed:", error);
            throw new Error(error.message);
        }

        console.log("Email sent:", data.id);
    } catch (error) {
        console.error("Email sending failed:", error.message);
        throw error;
    }
};

export default sendEmail;