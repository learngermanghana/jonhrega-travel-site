# Jonhrega Travel and Tours Website

React + Vite website for Jonhrega Travel and Tours.

## Sedifex integration

The `/services` page loads the live product/service catalog through a server-side API proxy:

- `GET /api/sedifex/products`
- Upstream: `GET /v1IntegrationProducts?storeId=<storeId>`
- Services are filtered by `itemType === "service"` or `type === "SERVICE"`.

The `/booking` page creates a Sedifex booking first, then starts hosted checkout when the selected service has a price:

- `POST /api/sedifex/bookings`
- Upstream booking: `POST /v1IntegrationBookings?storeId=<storeId>`
- Upstream checkout: `POST /integrationCheckoutCreate`

The `/payment/return` page only shows a processing message. It does not mark payment as confirmed. Final confirmation must come from Sedifex/Paystack verification or webhook processing.

## Required environment variables

Add these in Vercel or the website backend environment. Do not expose keys with `NEXT_PUBLIC_` or `VITE_`.

```bash
SEDIFEX_API_BASE_URL=https://us-central1-sedifex-web.cloudfunctions.net
SEDIFEX_INTEGRATION_API_BASE_URL=https://us-central1-sedifex-web.cloudfunctions.net
SEDIFEX_BOOKING_TARGET_STORE_ID=store_123
SEDIFEX_BOOKING_API_KEY=sedx_store_key_here
SEDIFEX_CHECKOUT_API_KEY=sedx_store_key_here
SEDIFEX_INTEGRATION_CHECKOUT_CREATE_URL=https://us-central1-sedifex-web.cloudfunctions.net/integrationCheckoutCreate
SEDIFEX_CHECKOUT_RETURN_URL=https://www.jonhregatravelandtours.com/payment/return
SEDIFEX_CONTRACT_VERSION=2026-04-13
```

The Sedifex API key must be allowed for the same store id used by `SEDIFEX_BOOKING_TARGET_STORE_ID`.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
