"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Calendar, CreditCard, CheckSquare, UserCog, Shield } from "lucide-react";

const navigation = [
  { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Memberships", href: "/admin/memberships", icon: Users },
  { name: "Bookings", href: "/admin/bookings", icon: Calendar },
  { name: "User Management", href: "/admin/users", icon: UserCog },
  { name: "Transactions", href: "/admin/transactions", icon: CreditCard },
  { name: "Approvals", href: "/admin/approvals", icon: CheckSquare },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r min-h-screen sticky top-20">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <Shield className="w-8 h-8 text-[var(--color-accent-sage)]" />
          <div>
            <h2 className="font-bold text-lg" style={{ fontFamily: "var(--font-display)" }}>Admin Panel</h2>
            <p className="text-xs text-gray-500">Control Center</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-[var(--color-accent-sage)] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
