
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

async function enviarCorreo({ para, asunto, mensaje }) {
    if (
        !process.env.SMTP_USER ||
        !process.env.SMTP_PASS ||
        !process.env.SMTP_FROM
    ) {
        throw new Error("Faltan variables SMTP en la configuración");
    }

    return await transporter.sendMail({
        from: `"BoletoNet.GT" <${process.env.SMTP_FROM}>`,
        to: para,
        subject: asunto,
        text: mensaje
    });
}

module.exports = { enviarCorreo };
