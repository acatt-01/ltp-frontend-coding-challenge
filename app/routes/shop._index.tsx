import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link, useSearchParams } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") || 1);

    // Get search parameter (this is supported by the API)
    const search = url.searchParams.get("search") || "";

    // For better filtering, we'll fetch more products at once
    // You can adjust this limit based on your needs
    const limit = 100; // Increased limit to allow proper client-side filtering
    const skip = search ? (page - 1) * 10 : 0; // Only use skip for search, since we're doing client-side pagination

    // Build the API URL
    let apiUrl = `https://dummyjson.com/products`;

    if (search) {
        // Use search endpoint if search query is provided
        apiUrl = `https://dummyjson.com/products/search?q=${search}&limit=${limit}&skip=${skip}`;
    } else {
        // For non-search requests, fetch more products for client-side filtering
        apiUrl = `https://dummyjson.com/products?limit=${limit}`;
    }

    const res = await fetch(apiUrl);
    if (!res.ok) throw new Response("Failed to fetch products", { status: 500 });
    const data = await res.json();

    // Use hardcoded categories for reliability
    const categories = [
        "beauty", "fragrances", "furniture", "groceries", "home-decoration", "kitchen-accessories", "laptops", "mens-shirts",
        "mens-shoes", "mens-watches", "mobile-accessories", "motorcycle", "skin-care", "smartphones", "sports-accessories", "sunglasses",
        "tablets", "tops", "vehicle", "womens-bags", "womens-dresses", "womens-jewellery", "womens-shoes", "womens-watches"
    ];

    return json({
        products: data.products,
        total: data.total,
        page,
        categories
    });
}

// Helper function to format category names
function formatCategoryName(category: string): string {
    if (typeof category !== 'string') {
        return String(category);
    }

    return category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export default function ShopIndex() {
    const { products, total, page, categories } = useLoaderData<typeof loader>();
    const [searchParams, setSearchParams] = useSearchParams();

    // Current filter values
    const currentSort = searchParams.get("sort") || "";
    const currentOrder = searchParams.get("order") || "asc";
    const currentCategory = searchParams.get("category") || "";
    const currentMinPrice = searchParams.get("minPrice") || "";
    const currentMaxPrice = searchParams.get("maxPrice") || "";
    const currentSearch = searchParams.get("search") || "";

    // Apply client-side filtering and sorting to ALL products
    let filteredProducts = [...products];

    // Filter by category (client-side)
    if (currentCategory) {
        filteredProducts = filteredProducts.filter(
            product => product.category === currentCategory
        );
    }

    // Filter by price range (client-side)
    if (currentMinPrice) {
        filteredProducts = filteredProducts.filter(
            product => product.price >= Number(currentMinPrice)
        );
    }
    if (currentMaxPrice) {
        filteredProducts = filteredProducts.filter(
            product => product.price <= Number(currentMaxPrice)
        );
    }

    // Apply sorting (client-side)
    if (currentSort) {
        filteredProducts.sort((a, b) => {
            let aVal = a[currentSort];
            let bVal = b[currentSort];

            // Handle different data types
            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (aVal < bVal) return currentOrder === 'asc' ? -1 : 1;
            if (aVal > bVal) return currentOrder === 'asc' ? 1 : -1;
            return 0;
        });
    }

    // Client-side pagination
    const itemsPerPage = 10;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const updateFilters = (updates: Record<string, string>) => {
        const newParams = new URLSearchParams(searchParams);

        // Reset to page 1 when filters change
        newParams.set("page", "1");

        Object.entries(updates).forEach(([key, value]) => {
            if (value) {
                newParams.set(key, value);
            } else {
                newParams.delete(key);
            }
        });

        setSearchParams(newParams);
    };

    const clearFilters = () => {
        setSearchParams({});
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Products</h1>

            {/* Search Box */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={currentSearch}
                    onChange={(e) => updateFilters({ search: e.target.value })}
                    className="w-full p-2 border rounded"
                />
            </div>

            {/* Filters and Sorting */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {/* Category Filter */}
                <select
                    value={currentCategory}
                    onChange={(e) => updateFilters({ category: e.target.value })}
                    className="p-2 border rounded"
                >
                    <option value="">All Categories</option>
                    {categories.map((cat: string) => (
                        <option key={cat} value={cat}>
                            {formatCategoryName(cat)}
                        </option>
                    ))}
                </select>

                {/* Price Range */}
                <input
                    type="number"
                    placeholder="Min Price"
                    value={currentMinPrice}
                    onChange={(e) => updateFilters({ minPrice: e.target.value })}
                    className="p-2 border rounded"
                    min="0"
                />
                <input
                    type="number"
                    placeholder="Max Price"
                    value={currentMaxPrice}
                    onChange={(e) => updateFilters({ maxPrice: e.target.value })}
                    className="p-2 border rounded"
                    min="0"
                />

                {/* Sorting */}
                <select
                    value={currentSort ? `${currentSort}-${currentOrder}` : ""}
                    onChange={(e) => {
                        const [sort, order] = e.target.value.split("-");
                        updateFilters({ sort, order });
                    }}
                    className="p-2 border rounded"
                >
                    <option value="">Default Order</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating-desc">Highest Rated</option>
                    <option value="title-asc">Name: A to Z</option>
                    <option value="title-desc">Name: Z to A</option>
                </select>
            </div>

            {/* Filter Summary */}
            {(currentSort || currentCategory || currentMinPrice || currentMaxPrice || currentSearch) && (
                <div className="mb-4 flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                        Showing {paginatedProducts.length} of {filteredProducts.length} products
                        {filteredProducts.length !== total && ` (from ${total} total)`}
                    </span>
                    <button
                        onClick={clearFilters}
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                    >
                        Clear All Filters
                    </button>
                </div>
            )}

            {/* Products Grid */}
            <div className="flex flex-wrap gap-12">
                {paginatedProducts.map((p: any) => (
                    <Link
                        key={p.id}
                        to={`/shop/${p.id}`}
                        className="block border rounded p-4 hover:shadow w-64"
                    >
                        <img
                            src={p.thumbnail}
                            alt={p.title}
                            className="w-full h-48 object-cover mb-2 border rounded"
                        />
                        <h2 className="text-sm font-bold mb-1">{p.title}</h2>
                        <p className="text-lg font-semibold mb-1">${p.price}</p>
                        <p className="text-sm text-gray-600 mb-1 capitalize">
                            {formatCategoryName(p.category)}
                        </p>
                        <div className="flex items-center">
                            <span className="text-yellow-500">★</span>
                            <span className="text-sm ml-1">{p.rating}</span>
                        </div>
                    </Link>
                ))}
            </div>

            {/* No Results Message */}
            {paginatedProducts.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">No products found. Try adjusting your filters.</p>
                    <button
                        onClick={clearFilters}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Clear All Filters
                    </button>
                </div>
            )}

            {/* Pagination */}
            {filteredProducts.length > 0 && totalPages > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                    {page > 1 && (
                        <Link
                            to={`/shop?${new URLSearchParams({
                                ...Object.fromEntries(searchParams),
                                page: (page - 1).toString()
                            })}`}
                            className="px-3 py-1 border rounded"
                        >
                            Prev
                        </Link>
                    )}
                    <span className="px-3 py-1">
                        Page {page} of {totalPages}
                    </span>
                    {page < totalPages && (
                        <Link
                            to={`/shop?${new URLSearchParams({
                                ...Object.fromEntries(searchParams),
                                page: (page + 1).toString()
                            })}`}
                            className="px-3 py-1 border rounded"
                        >
                            Next
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}