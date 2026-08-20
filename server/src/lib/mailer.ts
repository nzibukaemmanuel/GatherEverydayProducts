import nodemailer, { Transporter } from 'nodemailer';

let transporter: Transporter | null = null;
let warnedNoConfig = false;

function getTransporter(): Transporter | null {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    if (!warnedNoConfig) {
      console.warn('[mailer] SMTP not configured — reset links will only be logged to the console.');
      warnedNoConfig = true;
    }
    return null;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return transporter;
}

export async function sendPasswordResetEmail(email: string, resetUrl: string): Promise<void> {
  const client = getTransporter();
  if (!client) {
    console.log(`[password reset] ${email} -> ${resetUrl}`);
    return;
  }

  const from = process.env.MAIL_FROM || process.env.SMTP_USER;

  await client.sendMail({
    from,
    to: email,
    subject: 'Reset your Gather password',
    text: `We received a request to reset your Gather account password.\n\nReset it here (valid for 30 minutes):\n${resetUrl}\n\nIf you didn't request this, you can ignore this email.`,
    html: `
      <p>We received a request to reset your Gather account password.</p>
      <p><a href="${resetUrl}">Reset your password</a> (valid for 30 minutes).</p>
      <p>If you didn't request this, you can ignore this email.</p>
    `,
  });
}
