import { Link, useLoaderData } from "@remix-run/react";
import { ShoppingCart } from "lucide-react";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { getCartItems } from "../api/cart.server";

export async function loader({ request }: LoaderFunctionArgs) {
    const cartItems = await getCartItems(request);
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    return json({ cartCount });
}

export function CartButton() {
    const { cartCount } = useLoaderData<typeof loader>();

    return (
        <Link
            to="/cart"
            className="relative hover:text-black transition"
            aria-label={`Cart with ${cartCount} items`}
        >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 rounded-full bg-black px-1.5 text-xs font-medium text-white min-w-[20px] text-center">
                    {cartCount}
                </span>
            )}
        </Link>
    );
}