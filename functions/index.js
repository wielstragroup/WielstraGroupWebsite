/**
 * Firebase Cloud Functions for Wielstra Group
 * Handles contact form emails
 */

const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

// Configure your SMTP provider here (e.g., SendGrid, Mailgun, or Gmail)
// Use firebase functions:config:set to set these values
// firebase functions:config:set mail.user="user@example.com" mail.pass="password"
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().mail?.user,
    pass: functions.config().mail?.pass,
  },
});

exports.sendContactEmail = functions.firestore
  .document('contacts/{contactId}')
  .onCreate(async (snap, context) => {
    const newValue = snap.data();

    const mailOptions = {
      from: `"Wielstra Group Website" <${functions.config().mail?.user}>`,
      to: 'wielstragroup@gmail.com',
      subject: `Nieuw contactformulier van ${newValue.name}`,
      text: `
        Naam: ${newValue.name}
        Email: ${newValue.email}
        Telefoon: ${newValue.phone || 'Niet opgegeven'}
        Bedrijf: ${newValue.company || 'Niet opgegeven'}
        
        Bericht:
        ${newValue.message}
      `,
    };

    try {
      await mailTransport.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  });
