require('dotenv').config();
const Brevo = require('@getbrevo/brevo');

const apiInstance = new Brevo.TransactionalEmailsApi();

// Set API key from environment variables
apiInstance.authentications['apiKey'].apiKey = process.env.BREVO_API_KEY;

/**
 * Send email using Brevo (Sendinblue)
 * @param {Object} emaildata
 * @param {string} emaildata.email - Recipient email
 * @param {string} emaildata.subject - Email subject
 * @param {string} emaildata.html - Email body (HTML)
 */
const sendMail = async (emaildata) => {
  try {
    const sendSmtpEmail = {
      sender: {
        name: 'CCIRL',            // Replace with your app or company name
        email: process.env.SENDER_EMAIL, // Verified sender in Brevo
      },
      to: [{ email: emaildata.email }],
      subject: emaildata.subject,
      htmlContent: emaildata.html,
    };

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`✅ Email sent to ${emaildata.email}`);
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    throw error; // so your controller can handle it
  }
};

module.exports = { sendMail };
