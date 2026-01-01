import Link from "next/link";
import AuthButtons from "./AuthButtons";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-orange-600">🍳</span>
            <span className="text-xl font-semibold text-gray-900">
              RecipeShare
            </span>
          </Link>
          <nav className="flex items-center space-x-4">
            <AuthButtons />
          </nav>
        </div>
      </div>
    </header>
  );
}

