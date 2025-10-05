import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from "@remix-run/react";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import Header from "./components/header";
import "./tailwind.css";
import { getCartItems } from "./api/cart.server";

/**
 * Server-side loader function that runs on every page request
 * Fetches global data needed across the entire application
 * This data is available to all components via useLoaderData
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const cartItems = await getCartItems(request);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return json({
    cartCount
  });
}

/* wraps the entire application / Rendered on both server and client */
export default function App() {
  const { cartCount } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-50 text-gray-900">
        <Header cartCount={cartCount} />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}