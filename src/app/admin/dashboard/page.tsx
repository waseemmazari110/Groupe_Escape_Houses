"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Home, User2 } from "lucide-react";
import { toast } from "sonner";

interface DashboardStats {
  totalBookings: number;
  totalUsers: number;
  propertyOwners: number;
  guests: number;
}

interface RecentBooking {
  id: number;
  guestName: string;
  propertyName: string;
  checkInDate: string;
  status: string;
}

interface RecentUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch dashboard stats
      const statsResponse = await fetch("/api/admin/dashboard/stats");
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Fetch recent bookings
      const bookingsResponse = await fetch("/api/bookings?limit=5");
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setRecentBookings(bookingsData.bookings?.slice(0, 5) || []);
      }

      // Fetch recent users
      const usersResponse = await fetch("/api/users?limit=5");
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setRecentUsers(usersData.users?.slice(0, 5) || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <Header />

      <div className="flex mt-20">
        <AdminSidebar />

        <main className="flex-1 p-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-8 h-8 text-[var(--color-accent-sage)]" />
              <h1 className="text-4xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                Dashboard
              </h1>
            </div>
            <p className="text-[var(--color-neutral-dark)]">Monitor your platform's performance</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent-sage)]"></div>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-blue-900">Total Bookings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold text-blue-900">
                        {stats?.totalBookings || 0}
                      </div>
                      <Calendar className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-purple-900">Total Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold text-purple-900">
                        {stats?.totalUsers || 0}
                      </div>
                      <Users className="w-8 h-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-green-900">Property Owners</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold text-green-900">
                        {stats?.propertyOwners || 0}
                      </div>
                      <Home className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-orange-900">Guests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold text-orange-900">
                        {stats?.guests || 0}
                      </div>
                      <User2 className="w-8 h-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Bookings and Users */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Bookings */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-[var(--color-accent-sage)]" />
                      <CardTitle>Recent Bookings</CardTitle>
                    </div>
                    <a
                      href="/admin/bookings"
                      className="text-sm text-[var(--color-accent-sage)] hover:underline"
                    >
                      View All
                    </a>
                  </CardHeader>
                  <CardContent>
                    {recentBookings.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">No bookings yet</p>
                    ) : (
                      <div className="space-y-4">
                        {recentBookings.map((booking) => (
                          <div key={booking.id} className="flex items-start gap-4 p-4 rounded-lg bg-gray-50">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                              <Calendar className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold">{booking.guestName}</div>
                              <div className="text-sm text-gray-600">{booking.propertyName}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                {new Date(booking.checkInDate).toLocaleDateString('en-GB')}
                              </div>
                            </div>
                            <span
                              className={`text-xs px-3 py-1 rounded-full ${getStatusColor(booking.status)}`}
                            >
                              {booking.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Users */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-[var(--color-accent-sage)]" />
                      <CardTitle>Recent Users</CardTitle>
                    </div>
                    <a
                      href="/admin/users"
                      className="text-sm text-[var(--color-accent-sage)] hover:underline"
                    >
                      View All
                    </a>
                  </CardHeader>
                  <CardContent>
                    {recentUsers.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">No users yet</p>
                    ) : (
                      <div className="space-y-4">
                        {recentUsers.map((user) => (
                          <div key={user.id} className="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
                            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-lg">
                              {user.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold">{user.name}</div>
                              <div className="text-sm text-gray-600">{user.email}</div>
                            </div>
                            <div className="text-right">
                              <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                                {user.role}
                              </span>
                              <div className="mt-1">
                                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(user.status)}`}>
                                  {user.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
