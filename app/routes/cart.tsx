import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link, Form } from "@remix-run/react";
import { getCartItems, updateCartQuantity, removeFromCart } from "../api/cart.server";

// loader function that runs on the server when the cart page is requested
export async function loader({ request }: LoaderFunctionArgs) {
    // Get cart 
    const cartItems = await getCartItems(request);

    // Fetch product details for each item in cart
    const cartItemsWithDetails = await Promise.all(
        cartItems.map(async (item) => {
            try {
                const res = await fetch(`https://dummyjson.com/products/${item.productId}`);
                if (!res.ok) return null;
                const product = await res.json();
                // return combined cart item with product details
                return {
                    ...item,
                    product,
                    total: product.price * item.quantity
                };
            } catch (error) {
                return null;
            }
        })
    );

    // Filter out any failed requests
    const validItems = cartItemsWithDetails.filter(item => item !== null);

    // Calculate totals
    const subtotal = validItems.reduce((sum, item) => sum + item.total, 0);
    const shipping = 20.00;
    const total = subtotal + shipping;

    // Return data to the component
    return json({
        cartItems: validItems,
        subtotal: subtotal.toFixed(2),
        shipping: shipping.toFixed(2),
        total: total.toFixed(2)
    });
}

{/* Action function that handles form submissions (updating quantities, removing items) */ }
export async function action({ request }: ActionFunctionArgs) {

    // Parse form data from the request
    const formData = await request.formData();
    const intent = formData.get("intent"); // Determine what action to perform
    const productId = Number(formData.get("productId")); // Get product ID from form

    // Handle quantity updates
    if (intent === "update-quantity") {
        const quantity = Number(formData.get("quantity")); // Get new quantity from form
        const { cookie } = await updateCartQuantity(request, productId, quantity);
        return json({ success: true }, { headers: { "Set-Cookie": cookie } });
    }

    // item removal
    if (intent === "remove-item") {
        const { cookie } = await removeFromCart(request, productId);
        return json({ success: true }, { headers: { "Set-Cookie": cookie } });
    }

    return json({ success: false });
}

{/* Displays shopping cart items and summary */ }
export default function CartPage() {

    // Get cart data from the loader function
    const { cartItems, subtotal, shipping, total } = useLoaderData<typeof loader>();

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold">THE ONLINE STORE</h1>
            </div>

            {/* empty cart state */}
            {cartItems.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-xl mb-4">Your cart is empty</p>
                    <Link to="/shop" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                /* cart with items */
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* cart items list */}
                    <div className="lg:w-2/3">
                        <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
                        {/* Map through each cart item and display it */}
                        {cartItems.map((item) => (
                            <div key={item.productId} className="border-b py-4">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={item.product.thumbnail}
                                        alt={item.product.title}
                                        className="w-20 h-20 object-cover border rounded"
                                    />
                                    {/* Product Information */}
                                    <div className="flex-1">
                                        <h3 className="font-bold">{item.product.title}</h3>
                                        <p className="text-green-600 font-bold">${item.product.price}</p>
                                    </div>

                                    {/* Use Forms for quantity updates */}
                                    <Form method="post" className="flex items-center gap-2">
                                        <input type="hidden" name="intent" value="update-quantity" />
                                        <input type="hidden" name="productId" value={item.productId} />
                                        {/* decrease quantity button */}
                                        <button
                                            type="submit"
                                            name="quantity"
                                            value={item.quantity - 1}
                                            className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100"
                                        >
                                            -
                                            {/* increase quantity button */}
                                        </button>
                                        <span className="w-8 text-center">{item.quantity}</span>
                                        <button
                                            type="submit"
                                            name="quantity"
                                            value={item.quantity + 1}
                                            className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100"
                                        >
                                            +
                                        </button>
                                    </Form>

                                    {/* Remove Item Form */}
                                    <Form method="post">
                                        <input type="hidden" name="intent" value="remove-item" />
                                        <input type="hidden" name="productId" value={item.productId} />
                                        <button
                                            type="submit"
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Remove
                                        </button>
                                    </Form>
                                </div>
                            </div>
                        ))}

                        <div className="mt-6">
                            <Link to="/shop" className="text-blue-500 hover:underline">
                                ← Continue Shopping
                            </Link>
                        </div>
                    </div>

                    <div className="lg:w-1/3">
                        <div className="border rounded-lg p-6">
                            <h2 className="text-xl font-bold mb-4">Cart Summary</h2>
                            {/* Price Breakdown */}
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-bold">${subtotal}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="font-bold">${shipping}</span>
                                </div>
                                <div className="flex justify-between border-t pt-2">
                                    <span>Total</span>
                                    <span className="font-bold">${total}</span>
                                </div>
                            </div>

                            <button className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 mb-4">
                                Check Out
                            </button>

                            <p className="text-center text-gray-600 mb-4">Or pay with PayPal</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
