"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, Calendar, Camera, ShoppingCart, User } from "lucide-react";

export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Calendar, label: "Routine", path: "/routine" },
    { icon: Camera, label: "Scan", path: "/camera" },
    { icon: ShoppingCart, label: "Shop", path: "/cart" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
      <nav className="max-w-lg mx-auto">
        <ul className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <li key={item.path} className="flex-1">
                <button
                  onClick={() => router.push(item.path)}
                  className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                    isActive
                      ? "text-[#0065B7]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon className="w-6 h-6 mb-1" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
