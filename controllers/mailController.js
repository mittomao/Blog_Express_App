const nodemailer = require("nodemailer");
const weddingWishes = require('../models/weddingWishesModel');

// Cấu hình email và mật khẩu
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SMTP_HOST,
    port: process.env.EMAIL_SMTP_PORT,
    auth: {
        user: process.env.EMAIL_SMTP_USER, // Email tài khoản Sendinblue
        pass: process.env.EMAIL_SMTP_PASS, // API key của Sendinblue
    },
});

// Cloud Function để gửi email
exports.sendEmail = async (req, res) => {

    if (req.method !== "POST") {
        return res.status(405).send("Phương thức không được hỗ trợ.");
    }

    const { name, message } = req.body;


    if (!name || !message) {
        return res.status(400).send("Thiếu thông tin cần thiết.");
    }

    const mailOptions = {
        from: process.env.EMAIL_FROM,  // Email người nhận (email của bạn)
        to: process.env.EMAIL_TO,  // Email người nhận (email của bạn)
        subject: "Những Lời Chúc Đẹp Nhất Gửi Đến 2 Vợ Chồng!",
        text: `Trân thành cảm ơn <b>${name} </b> đã gửi lời chúc đến 2 vợ chồng như sau: \n\n${message}.`
    };

    try {
        await weddingWishes.create({
            name,
            message
        });

        await transporter.sendMail(mailOptions);
        res.status(200).send("Email đã được gửi thành công.");
    } catch (error) {
        console.error("Lỗi gửi email:", error);
        res.status(500).send("Gửi email thất bại.");
    }
};
