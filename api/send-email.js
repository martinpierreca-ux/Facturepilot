import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  const { email, subject, text } = req.body;

  try {
    await resend.emails.send({
      from: 'FacturePilot <onboarding@resend.dev>',
      to: email,
      subject: subject,
      text: text,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ error });
  }
}
