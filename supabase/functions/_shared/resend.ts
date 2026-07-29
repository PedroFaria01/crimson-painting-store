// Thin wrapper around the Resend REST API — no SDK needed for one email.
// If RESEND_API_KEY isn't set, this quietly no-ops so local/dev setups
// that haven't configured email yet don't fail the whole webhook.

interface OrderForEmail {
  order_number: string
  customer_email: string
  customer_name: string
  subtotal_cents: number
  shipping_cents: number
  total_cents: number
  currency: string
}

interface OrderItemForEmail {
  product_name: string
  unit_price_cents: number
  quantity: number
}

function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat('en-IE', { style: 'currency', currency }).format(cents / 100)
}

function buildEmailHtml(order: OrderForEmail, items: OrderItemForEmail[]) {
  const rows = items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;color:#3a2a2a;">${item.quantity} × ${item.product_name}</td>
          <td style="padding:8px 0;text-align:right;color:#3a2a2a;">
            ${formatMoney(item.unit_price_cents * item.quantity, order.currency)}
          </td>
        </tr>`
    )
    .join('')

  return `
    <div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;color:#3a2a2a;">
      <h1 style="font-size:20px;margin-bottom:4px;">Crimson Painting</h1>
      <p style="color:#6b5656;margin-top:0;">Order ${order.order_number} confirmed</p>
      <p>Hi ${order.customer_name}, thanks for your order — it's confirmed and on its way to the forge.</p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;">
        ${rows}
        <tr><td style="padding-top:12px;border-top:1px solid #ddd;">Subtotal</td>
          <td style="padding-top:12px;border-top:1px solid #ddd;text-align:right;">${formatMoney(order.subtotal_cents, order.currency)}</td></tr>
        <tr><td>Shipping</td><td style="text-align:right;">${formatMoney(order.shipping_cents, order.currency)}</td></tr>
        <tr><td style="font-weight:bold;padding-top:8px;">Total</td>
          <td style="font-weight:bold;padding-top:8px;text-align:right;">${formatMoney(order.total_cents, order.currency)}</td></tr>
      </table>
      <p style="color:#6b5656;font-size:13px;">We'll be in touch if anything needs your attention. Thanks for supporting the studio!</p>
    </div>`
}

export async function sendOrderConfirmationEmail(order: OrderForEmail, items: OrderItemForEmail[]) {
  const apiKey = Deno.env.get('RESEND_API_KEY')
  if (!apiKey) {
    console.warn('RESEND_API_KEY not set — skipping order confirmation email')
    return
  }

  const from = Deno.env.get('RESEND_FROM_EMAIL') || 'Crimson Painting <onboarding@resend.dev>'

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: order.customer_email,
      subject: `Order ${order.order_number} confirmed — Crimson Painting`,
      html: buildEmailHtml(order, items),
    }),
  })

  if (!res.ok) {
    console.error('Failed to send order confirmation email', await res.text())
  }
}
