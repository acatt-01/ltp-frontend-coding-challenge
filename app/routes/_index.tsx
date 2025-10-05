import { Link } from "@remix-run/react";

export default function HomePage() {
    return (
        <div className="p-4">
            <img
                src="/images/welcome.jpg"
                alt="Welcome to our store"
                className="w-full h-full object-cover rounded-lg shadow-md mb-8"
            />
            <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2">
                <Link
                    to="/shop"
                    className="bg-teal-700 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition"
                >
                    Shop Now
                </Link>
            </div>
        </div>
    );
}