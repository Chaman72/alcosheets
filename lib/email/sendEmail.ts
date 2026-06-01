export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  // Using fetch to call an email API (SendGrid / SMTP relay)
  // Replace SENDGRID_API_KEY in your .env.local
  const apiKey = process.env.SENDGRID_API_KEY;

  if (!apiKey) {
    console.warn("SENDGRID_API_KEY not set. Email not sent.");
    return false;
  }

  try {
    const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: payload.to }] }],
        from: { email: process.env.FROM_EMAIL ?? "noreply@xyzpanels.com", name: "XYZ Panels" },
        subject: payload.subject,
        content: [{ type: "text/html", value: payload.html }],
      }),
    });
    return res.ok;
  } catch (err) {
    console.error("Email send error:", err);
    return false;
  }
}

export function inquiryEmailTemplate(data: {
  name: string; email: string; phone?: string; product?: string; message: string;
}): string {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
      <div style="background:#c9a84c;padding:24px;text-align:center">
        <h1 style="color:#000;margin:0;font-size:22px">New Inquiry — XYZ Panels</h1>
      </div>
      <div style="padding:24px;background:#fff">
        <table style="width:100%;border-collapse:collapse">
          ${[
            ["Name", data.name],
            ["Email", data.email],
            ["Phone", data.phone || "—"],
            ["Product Interest", data.product || "—"],
          ].map(([k, v]) => `
            <tr>
              <td style="padding:10px;background:#f9fafb;font-weight:600;width:140px;border-bottom:1px solid #e5e7eb">${k}</td>
              <td style="padding:10px;border-bottom:1px solid #e5e7eb">${v}</td>
            </tr>
          `).join("")}
        </table>
        <div style="margin-top:16px;padding:16px;background:#f9fafb;border-radius:6px">
          <strong>Message:</strong>
          <p style="margin:8px 0 0">${data.message}</p>
        </div>
      </div>
      <div style="padding:16px;background:#f3f4f6;text-align:center;font-size:12px;color:#6b7280">
        © ${new Date().getFullYear()} XYZ Panels — This is an automated notification.
      </div>
    </div>
  `;
}
