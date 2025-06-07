import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: 'Gmail', 
    auth: {
        user: process.env.HOST_MAIL!,
        pass: process.env.HOST_MAIL_PASS!,
    },
})

export const sendVerificationEmail = async (to: string, token: string) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: process.env.HOST_MAIL,
    to,
    subject: 'Email verification for wrapy',
    html: `<p>Click to verify: <a href="${verifyUrl}">Verify Email</a></p>`,
  });

};
