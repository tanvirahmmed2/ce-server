require('dotenv').config()
const nodemailer= require('nodemailer')

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // SMTP server hostname
  port: 587,                // Port for secure connections
  secure: false,            // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

const sendMail= async(emaildata)=>{
  const mailOptions={
    from: process.env.SMTP_USER,
    to: emaildata.email,
    subject: emaildata.subject,
    html: emaildata.html, 
  }
  await transporter.sendMail(mailOptions)
}

module.exports= {transporter, sendMail}