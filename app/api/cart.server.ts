import { getCart, updateCart, type CartItem } from "../sessions";

/* Retrieves all items from the user's shopping cart, reads from server session so data is persisten across requests */
export async function getCartItems(request: Request) {
  return await getCart(request);
}

/* Adds a product to the shopping cart or updates its quantity if already present */
export async function addToCart(request: Request, productId: number, quantity: number = 1) {
  const cart = await getCart(request);
  const existingItem = cart.find(item => item.productId === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }
  
  const cookie = await updateCart(request, cart);
  return { cart, cookie };
}

export async function removeFromCart(request: Request, productId: number) {
  const cart = (await getCart(request)).filter(item => item.productId !== productId);
  const cookie = await updateCart(request, cart);
  return { cart, cookie };
}

/* Handles both increasing and decreasing quantities, including removal if quantity <= 0 */
export async function updateCartQuantity(request: Request, productId: number, quantity: number) {
  let cart = await getCart(request);
  const item = cart.find(item => item.productId === productId);
  
  if (item) {
    if (quantity <= 0) {
      return removeFromCart(request, productId);
    } else {
      item.quantity = quantity;
      const cookie = await updateCart(request, cart);
      return { cart, cookie };
    }
  }
  
  // If item wasn't found, return current cart state unchanged
  return { cart, cookie: request.headers.get("Cookie") || "" };
}