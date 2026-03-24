import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const PRICE_CENTS = 6999 // 69.99 EUR
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export async function createCheckoutSession(
  classId: string,
  moderatorEmail: string
): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    currency: 'eur',
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'eur',
          unit_amount: PRICE_CENTS,
          product_data: {
            name: 'Лексикон на класа',
            description: 'Публикуване и постоянен достъп до дигиталния лексикон',
          },
        },
      },
    ],
    customer_email: moderatorEmail,
    metadata: { classId },
    success_url: `${APP_URL}/moderator/${classId}/finalize?payment=success`,
    cancel_url: `${APP_URL}/moderator/${classId}/finalize?payment=cancelled`,
  })

  return session.url ?? ''
}

export function verifyWebhook(payload: string, signature: string) {
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  )
}
