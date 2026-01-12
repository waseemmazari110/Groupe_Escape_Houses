"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home, Search, Eye, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Image from "next/image";

interface Property {
  id: number;
  title: string;
  location: string;
  ownerName: string;
  ownerEmail: string;
  images: string[];
  submittedDate: string;
  status: string;
}

interface ApprovalStats {
  pending: number;
  approved: number;
  rejected: number;
}

export default function ApprovalsPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [stats, setStats] = useState<ApprovalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("approved");

  useEffect(() => {
    fetchProperties();
    fetchStats();
  }, [statusFilter]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/properties?status=${statusFilter}`);
      if (response.ok) {
        const data = await response.json();
        setProperties(data.properties || []);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/properties/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      const response = await fetch(`/api/properties/${id}/approve`, {
        method: "POST",
      });
      if (response.ok) {
        toast.success("Property approved successfully");
        fetchProperties();
        fetchStats();
      }
    } catch (error) {
      console.error("Error approving property:", error);
      toast.error("Failed to approve property");
    }
  };

  const handleReject = async (id: number) => {
    if (!confirm("Are you sure you want to reject this property?")) return;
    
    try {
      const response = await fetch(`/api/properties/${id}/reject`, {
        method: "POST",
      });
      if (response.ok) {
        toast.success("Property rejected");
        fetchProperties();
        fetchStats();
      }
    } catch (error) {
      console.error("Error rejecting property:", error);
      toast.error("Failed to reject property");
    }
  };

  const handleUnpublish = async (id: number) => {
    if (!confirm("Are you sure you want to unpublish this property?")) return;
    
    try {
      const response = await fetch(`/api/properties/${id}/unpublish`, {
        method: "POST",
      });
      if (response.ok) {
        toast.success("Property unpublished");
        fetchProperties();
        fetchStats();
      }
    } catch (error) {
      console.error("Error unpublishing property:", error);
      toast.error("Failed to unpublish property");
    }
  };

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.ownerName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex">
        <AdminSidebar />

        <main className="flex-1 p-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Home className="w-8 h-8 text-[var(--color-accent-sage)]" />
              <h1 className="text-4xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                Property Approvals
              </h1>
            </div>
            <p className="text-[var(--color-neutral-dark)]">Review and approve property listings from owners</p>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-yellow-900">Pending</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-900">{stats.pending}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-green-900">Approved</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-900">{stats.approved}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-red-900">Rejected</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-900">{stats.rejected}</div>
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
                  All ({(stats?.pending || 0) + (stats?.approved || 0) + (stats?.rejected || 0)})
                </Button>
                <Button
                  variant={statusFilter === "pending" ? "default" : "outline"}
                  onClick={() => setStatusFilter("pending")}
                  className={statusFilter === "pending" ? "bg-blue-600 text-white" : ""}
                >
                  Pending ({stats?.pending || 0})
                </Button>
                <Button
                  variant={statusFilter === "approved" ? "default" : "outline"}
                  onClick={() => setStatusFilter("approved")}
                  className={statusFilter === "approved" ? "bg-blue-600 text-white" : ""}
                >
                  Approved ({stats?.approved || 0})
                </Button>
                <Button
                  variant={statusFilter === "rejected" ? "default" : "outline"}
                  onClick={() => setStatusFilter("rejected")}
                  className={statusFilter === "rejected" ? "bg-blue-600 text-white" : ""}
                >
                  Rejected ({stats?.rejected || 0})
                </Button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by property name, location, or owner..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Properties Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent-sage)]"></div>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-12">
              <Home className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-2">No properties found</p>
              <p className="text-sm text-gray-500">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <Card key={property.id} className="overflow-hidden">
                  <div className="relative h-48">
                    {property.images && property.images.length > 0 ? (
                      <Image
                        src={property.images[0]}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Home className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge
                        className={
                          property.status === "approved"
                            ? "bg-green-500 text-white"
                            : property.status === "pending"
                            ? "bg-yellow-500 text-white"
                            : "bg-red-500 text-white"
                        }
                      >
                        {property.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2">{property.title}</h3>
                    <div className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                      <Home className="w-4 h-4" />
                      {property.location}
                    </div>
                    
                    <div className="bg-purple-50 rounded p-3 mb-3">
                      <button className="text-sm text-purple-700 font-medium flex items-center gap-1 w-full">
                        📧 Owner Details
                      </button>
                    </div>

                    <div className="text-xs text-gray-500 mb-4">
                      📅 Submitted {new Date(property.submittedDate).toLocaleDateString("en-GB")}
                    </div>

                    <div className="flex gap-2">
                      {property.status === "approved" ? (
                        <>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleUnpublish(property.id)}
                            className="flex-1 bg-red-600 hover:bg-red-700"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Unpublish
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`/destinations/property/${property.id}`, "_blank")}
                            className="flex-1"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Preview
                          </Button>
                        </>
                      ) : property.status === "pending" ? (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleApprove(property.id)}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`/destinations/property/${property.id}`, "_blank")}
                            className="flex-1"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Preview
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleApprove(property.id)}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            Re-approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`/destinations/property/${property.id}`, "_blank")}
                            className="flex-1"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Preview
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
