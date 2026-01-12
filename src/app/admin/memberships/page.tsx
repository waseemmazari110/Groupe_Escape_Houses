"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Search, RefreshCw, Download, CheckCircle2, TrendingUp, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Member {
  id: number;
  name: string;
  email: string;
  plan: string;
  status: string;
  amount: string;
  signupDate: string;
  nextBilling: string;
  payment: string;
}

interface MembershipStats {
  totalMembers: number;
  activeMembers: number;
  totalRevenue: number;
  newThisMonth: number;
}

export default function MembershipsPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [stats, setStats] = useState<MembershipStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchMembers();
    fetchStats();
  }, [statusFilter]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/memberships");
      if (response.ok) {
        const data = await response.json();
        setMembers(data.members || []);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      toast.error("Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/memberships/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || member.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportToCSV = () => {
    const headers = ["Member", "Email", "Plan", "Status", "Amount", "Signup Date", "Next Billing", "Payment"];
    const rows = filteredMembers.map((m) => [
      m.name,
      m.email,
      m.plan,
      m.status,
      m.amount,
      m.signupDate,
      m.nextBilling,
      m.payment,
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `memberships-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("Memberships exported successfully");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex">
        <AdminSidebar />

        <main className="flex-1 p-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-8 h-8 text-[var(--color-accent-sage)]" />
              <h1 className="text-4xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                Memberships
              </h1>
            </div>
            <p className="text-[var(--color-neutral-dark)]">Track membership sign-ups and payment status</p>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">{stats.totalMembers}</div>
                    <Users className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Active Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-green-600">{stats.activeMembers}</div>
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">£{stats.totalRevenue.toFixed(2)}</div>
                    <TrendingUp className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">New This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-purple-600">{stats.newThisMonth}</div>
                    <CreditCard className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>

                <Button onClick={() => fetchMembers()} variant="outline" className="w-full md:w-auto">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>

                <Button onClick={exportToCSV} variant="outline" className="w-full md:w-auto">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Members Table */}
          <Card>
            <CardContent className="pt-6">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent-sage)]"></div>
                </div>
              ) : filteredMembers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-2">No members found</p>
                  <p className="text-sm text-gray-500">Try adjusting your filters or search terms</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Signup Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Next Billing</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredMembers.map((member) => (
                        <tr key={member.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium text-gray-900">{member.name}</div>
                              <div className="text-sm text-gray-500">{member.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-900">{member.plan || "No Plan"}</span>
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              className={
                                member.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : member.status === "inactive"
                                  ? "bg-gray-100 text-gray-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {member.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium">{member.amount}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{member.signupDate}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{member.nextBilling || "-"}</td>
                          <td className="px-6 py-4">
                            <Badge
                              className={
                                member.payment?.toLowerCase() === "failed"
                                  ? "bg-red-100 text-red-800"
                                  : member.payment?.toLowerCase() === "paid"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {member.payment || "Pending"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
