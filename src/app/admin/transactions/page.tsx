"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditCard, Search, TrendingUp, DollarSign, XCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Transaction {
  id: number;
  memberName: string;
  memberEmail: string;
  amount: number;
  commission: number;
  plan: string;
  status: string;
  date: string;
  transactionId: string;
}

interface TransactionStats {
  totalRevenue: number;
  totalCommission: number;
  netRevenue: number;
  successful: number;
  pending: number;
  failed: number;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<TransactionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchTransactions();
    fetchStats();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/transactions?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/transactions/stats?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.memberName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.memberEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || transaction.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "succeeded":
      case "success":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-blue-100 text-blue-800";
      case "canceled":
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex">
        <AdminSidebar />

        <main className="flex-1 p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CreditCard className="w-8 h-8 text-[var(--color-accent-sage)]" />
                <h1 className="text-4xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                  Transactions
                </h1>
              </div>
              <Button
                onClick={() => {
                  fetchTransactions();
                  fetchStats();
                }}
                disabled={loading}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            <p className="text-[var(--color-neutral-dark)]">View all payment transactions from owners</p>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-green-900">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-green-900">£{stats.totalRevenue.toFixed(2)}</div>
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-purple-900">Total Commission (10%)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-purple-900">£{stats.totalCommission.toFixed(2)}</div>
                    <DollarSign className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-blue-900">Net Revenue (After Commission)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-blue-900">£{stats.netRevenue.toFixed(2)}</div>
                    <CheckCircle2 className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Transaction Status Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-emerald-900">Successful</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-emerald-900">{stats.successful}</div>
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-yellow-900">Pending</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-yellow-900">{stats.pending}</div>
                    <DollarSign className="w-8 h-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-red-900">Failed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-red-900">{stats.failed}</div>
                    <XCircle className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex gap-4 mb-6">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  onClick={() => setStatusFilter("all")}
                  className={statusFilter === "all" ? "bg-blue-600 text-white" : ""}
                >
                  All ({transactions.length})
                </Button>
                <Button
                  variant={statusFilter === "succeeded" ? "default" : "outline"}
                  onClick={() => setStatusFilter("succeeded")}
                  className={statusFilter === "succeeded" ? "bg-blue-600 text-white" : ""}
                >
                  Succeeded ({transactions.filter((t) => t.status.toLowerCase() === "succeeded").length})
                </Button>
                <Button
                  variant={statusFilter === "pending" ? "default" : "outline"}
                  onClick={() => setStatusFilter("pending")}
                  className={statusFilter === "pending" ? "bg-blue-600 text-white" : ""}
                >
                  Pending ({transactions.filter((t) => t.status.toLowerCase() === "pending").length})
                </Button>
                <Button
                  variant={statusFilter === "failed" ? "default" : "outline"}
                  onClick={() => setStatusFilter("failed")}
                  className={statusFilter === "failed" ? "bg-blue-600 text-white" : ""}
                >
                  Failed ({transactions.filter((t) => t.status.toLowerCase() === "failed").length})
                </Button>
                <Button
                  variant={statusFilter === "refunded" ? "default" : "outline"}
                  onClick={() => setStatusFilter("refunded")}
                  className={statusFilter === "refunded" ? "bg-blue-600 text-white" : ""}
                >
                  Refunded ({transactions.filter((t) => t.status.toLowerCase() === "refunded").length})
                </Button>
                <Button
                  variant={statusFilter === "canceled" ? "default" : "outline"}
                  onClick={() => setStatusFilter("canceled")}
                  className={statusFilter === "canceled" ? "bg-blue-600 text-white" : ""}
                >
                  Canceled ({transactions.filter((t) => t.status.toLowerCase() === "canceled").length})
                </Button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card>
            <CardContent className="pt-6">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent-sage)]"></div>
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-2">No transactions found</p>
                  <p className="text-sm text-gray-500">Try adjusting your filters or search terms</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission (10%)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredTransactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <span className="text-sm font-mono text-gray-600">{transaction.transactionId}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium text-gray-900">{transaction.memberName}</div>
                              <div className="text-sm text-gray-500">{transaction.memberEmail}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{transaction.plan}</td>
                          <td className="px-6 py-4 text-sm font-bold text-gray-900">£{transaction.amount.toFixed(2)}</td>
                          <td className="px-6 py-4 text-sm font-bold text-purple-700">£{transaction.commission.toFixed(2)}</td>
                          <td className="px-6 py-4">
                            <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {new Date(transaction.date).toLocaleDateString("en-GB")}
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
