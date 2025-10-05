import { Link } from "@remix-run/react";
import { ShoppingCart } from "lucide-react";

interface HeaderProps {
    cartCount: number;
}

export default function Header({ cartCount }: HeaderProps) {
    return (
        <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo and Main Navigation */}
                    <div className="flex items-center-safe space-x-8">
                        <Link to="/home" className="text-xl font-bold">
                            THE ONLINE STORE
                        </Link>

                        <nav className="flex items-center space-x-6">
                            <Link to="/_index" className="hover:text-black transition">
                                Home
                            </Link>
                            <Link to="/shop" className="hover:text-black transition">
                                Shop
                            </Link>
                            <Link to="/" className="hover:text-black transition">
                                About
                            </Link>
                            <Link to="/" className="hover:text-black transition">
                                Contact
                            </Link>
                            <Link to="/" className="hover:text-black transition">
                                Blog
                            </Link>
                        </nav>
                    </div>

                    {/* Cart and Account */}
                    <div className="flex items-center space-x-4">
                        <Link to="/" className="hover:text-black transition">
                            Account
                        </Link>

                        {/* Cart Button */}
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
                    </div>
                </div>
            </div>
        </header>
    );
}

