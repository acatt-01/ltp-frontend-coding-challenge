import { createCookieSessionStorage } from "@remix-run/node"; // Remix's session storage utilities for cookie-based sessions

/* Interface defining the structure of a single cart item */
export interface CartItem {
  productId: number;
  quantity: number;
}

/* Creates and configures session storage using cookies
  This is where cart data is persisted between requests */
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET || "fallback-secret-change-in-production"],
    secure: process.env.NODE_ENV === "production",
  },
});

/* Retrieves the current user's cart from their session */
export async function getCart(request: Request): Promise<CartItem[]> {
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  return session.get("cart") || [];
}

/* Updates the user's cart in their session and returns the updated session cookie */
export async function updateCart(request: Request, cart: CartItem[]): Promise<string> {
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  session.set("cart", cart);
  return sessionStorage.commitSession(session);
}