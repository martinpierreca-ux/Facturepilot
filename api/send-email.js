import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  try {
    const { to, subject, html } = req.body;

    await resend.emails.send({
      from: 'FacturePilot <onboarding@resend.dev>',
      to: to,
      subject: subject,
      html: html,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Email failed' });
  }
}
