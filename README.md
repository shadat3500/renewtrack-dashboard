# RenewTrack – Dashboard (Frontend)

Next.js 16 (App Router) + Tailwind CSS 4 frontend for the subscription renewal dashboard
(Figma: "nigertodaynew – Custom Dashboard").

## Run

```bash
npm install
npm run dev        # http://localhost:3000
```

Demo login: **owner@email.com / password123**

The frontend runs in **demo mode**: data is generated relative to today and saved in the
browser (localStorage). Settings → "Reset demo" restores it, "Clear all" shows the empty states.

## Screens

| Route | Screen |
|---|---|
| `/login` | Login (brand panel + form) |
| `/` | Dashboard – attention banner, stats, Expiring Soon, Recently Expired |
| `/customers` | Customers – search, All/Active/Expiring/Expired tabs |
| `/customers/new` | Add Customer – live expiry + status summary |
| `/customers/[id]` | Customer Details – plan, time remaining, renewal history, contact, delete |
| `/customers/[id]/edit` | Edit Customer |
| `/expiring` | Expiring Soon – 1–3 / 4–7 / 8–10 day filters |
| `/expired` | Expired |
| `/settings` | Account, change password, reminder settings |

Modals: Renew, Send Reminder (copy message), Delete confirm, Change Password.
Toasts for success/error, empty states on every list, mobile layout with bottom nav (< 1024px).

## Structure

```
src/
  app/
    login/                 login page
    (app)/                 protected area (sidebar + mobile nav + auth guard)
  components/
    ui/                    Button, Badge, Avatar, Card, Field, Modal, Toast, Tabs, …
    layout/                Sidebar, MobileNav, PageHeader, Logo
    customers/             CustomerTable, CustomerForm, Renew/Reminder/Delete modals
  lib/
    subscription.ts        business rules (expiry, status, renewal, templates)
    store.tsx              data store – each action maps to an API endpoint
    mock-data.ts           demo customers + default settings
    types.ts
```

Design tokens (colors, type scale) are copied from the Figma variables into `src/app/globals.css`.

## Connecting the backend

Replace the action bodies in `src/lib/store.tsx` with `fetch()` calls:

| Store action | API |
|---|---|
| `login` / `logout` | `POST /api/auth/login`, `POST /api/auth/logout` |
| `addCustomer` | `POST /api/customers` |
| `updateCustomer` | `PUT /api/customers/:id` |
| `renewCustomer` | `POST /api/customers/:id/renew` |
| `deleteCustomer` | `DELETE /api/customers/:id` |
| `updateSettings` | `PUT /api/settings` |
| `changePassword` | `PUT /api/auth/password` |

## Notes

- The logo is a placeholder (`components/layout/logo.tsx`). Put the client's logo in `/public` and swap it in.
- Renewal rule: new expiry = max(current expiry, today) + months. Confirm with the client.
