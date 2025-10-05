export async function fetchProducts(limit: number, skip: number) {
  const res = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}
