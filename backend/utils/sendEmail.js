import nodemailer from "nodemailer";

let transporter;

const getTransporter = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            connectionTimeout: 30000,
            greetingTimeout: 30000,
            socketTimeout: 30000,
            family: 4,
        });
    }
    return transporter;
};

const sendEmail = async (to, subject, text) => {
    try {
        const transporter = getTransporter();
        console.log("SMTP connection successful");
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        });
        console.log("Email sent:", info.messageId);
    } catch (error) {
        console.error("Email sending failed:");
        console.error(error);
        throw error;
    }
};

export default sendEmail;