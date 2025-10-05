// app/components/Header.tsx
import { Link } from "@remix-run/react";
import { Search, User, ShoppingCart } from "lucide-react";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b">
            <div className="mx-auto flex max-w-7xl items-center px-6 py-4">
                {/* Left: Logo */}
                <div className="flex-shrink-0">
                    <Link to="/" className="text-xl font-extrabold tracking-wide text-gray-900">
                        THE ONLINE STORE
                    </Link>
                </div>

                {/* Center: Nav links */}
                <div className="flex-1 flex justify-center">
                    <nav className="flex space-x-10 text-sm font-medium font-sans text-gray-700">
                        <Link to="/" className="hover:text-black transition">
                            Home
                        </Link>
                        <Link to="/shop" className="hover:text-black transition">
                            Shop
                        </Link>
                        <Link to="/about" className="hover:text-black transition">
                            About
                        </Link>
                        <Link to="/contact" className="hover:text-black transition">
                            Contact
                        </Link>
                        <Link to="/blog" className="hover:text-black transition">
                            Blog
                        </Link>
                    </nav>
                </div>

                {/* Right: Icons */}
                <div className="flex-shrink-0 flex items-center space-x-6 text-gray-700">
                    <button aria-label="Search" className="hover:text-black transition">
                        <Search className="h-5 w-5" />
                    </button>
                    <button aria-label="User" className="hover:text-black transition">
                        <User className="h-5 w-5" />
                    </button>
                    <button aria-label="Cart" className="relative hover:text-black transition">
                        <ShoppingCart className="h-5 w-5" />
                        {/* Example cart badge */}
                        <span className="absolute -top-2 -right-2 rounded-full bg-black px-1.5 text-xs font-medium text-white">
                            2
                        </span>
                    </button>
                </div>
            </div>
        </header>
    );
}

