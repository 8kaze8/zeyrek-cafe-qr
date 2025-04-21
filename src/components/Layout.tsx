import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  LayoutDashboard,
  List,
  Coffee,
  LogOut,
  Menu as MenuIcon,
} from "lucide-react";
import { useState } from "react";
import { clsx } from "clsx";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Panel", href: "/admin", icon: LayoutDashboard },
    { name: "Kategoriler", href: "/categories", icon: List },
    { name: "Ürünler", href: "/products", icon: Coffee },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Çıkış yapılamadı:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-400 hover:text-white"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
        <span className="text-white font-semibold">Admin Paneli</span>
      </div>

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-center h-16 px-4 bg-gray-900">
            <h1 className="text-xl font-bold text-white">Zeyrek Admin</h1>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={clsx(
                    location.pathname === item.href
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "group flex items-center px-2 py-2 text-base font-medium rounded-md"
                  )}
                >
                  <Icon
                    className={clsx(
                      location.pathname === item.href
                        ? "text-red-500"
                        : "text-gray-400 group-hover:text-gray-300",
                      "mr-4 flex-shrink-0 h-6 w-6"
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleSignOut}
              className="flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white w-full"
            >
              <LogOut className="mr-4 flex-shrink-0 h-6 w-6" />
              Çıkış Yap
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div
        className={clsx(
          "lg:pl-64 flex flex-col min-h-screen",
          "pt-16 lg:pt-0" // Add padding top on mobile for the menu button
        )}
      >
        <main className="flex-1 p-6">{children}</main>
      </div>

      {/* Mobile menu backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};
