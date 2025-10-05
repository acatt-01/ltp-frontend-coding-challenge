// app/routes/shop.$productId.tsx
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";

export async function loader({ params }: LoaderFunctionArgs) {
    const { productId } = params;
    if (!productId) throw new Response("Product ID missing", { status: 400 });

    const res = await fetch(`https://dummyjson.com/products/${productId}`);
    if (!res.ok) throw new Response("Product not found", { status: 404 });

    const product = await res.json();
    return json({ product });
}

export default function ProductDetail() {
    const { product } = useLoaderData<typeof loader>();

    return (
        <div className="p-4">
            {/* Simple Back Link */}
            <Link to="/shop" className="text-blue-500 hover:underline mb-4 inline-block">
                ← Back to Products
            </Link>

            {/* Product Container */}
            <div className="max-w-6xl mx-auto bg-white border rounded-lg p-6">
                {/* Product Image and Basic Info */}
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Image */}
                    <div className="md:w-1/2">
                        <img
                            src={product.thumbnail}
                            alt={product.title}
                            className="w-full h-96 object-cover border rounded"
                        />
                    </div>
                    {/* Product Details */}
                    <div className="md:w-1/2">
                        <h1 className="text-2xl font-bold mb-4">{product.title}</h1>
                        <p className="text-xl text-green-600 font-bold mb-4">${product.price}</p>

                        {/* Simple Rating */}
                        <div className="flex items-center mb-4">
                            <span className="text-yellow-500">★</span>
                            <span className="ml-1">{product.rating}</span>
                        </div>

                        {/* Add to Cart Button */}
                        <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
                            Add to Cart
                        </button>
                        {/* Description Section */}
                        <div className="mt-8">
                            <h2 className="text-lg font-bold mb-2">Description</h2>
                            <p className="text-gray-700">{product.description}</p>
                        </div>
                    </div>
                </div>

                {/* Simple Product Info */}
                <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                    <div>
                        <span className="font-medium">Category:</span>
                        <span className="ml-2 capitalize">{product.category}</span>
                    </div>
                    <div>
                        <span className="font-medium">Brand:</span>
                        <span className="ml-2">{product.brand}</span>
                    </div>
                    <div>
                        <span className="font-medium">In Stock:</span>
                        <span className="ml-2">{product.stock} units</span>
                    </div>
                </div>

            </div>
        </div>
    );
}