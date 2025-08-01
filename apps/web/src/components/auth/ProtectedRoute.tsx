"use client";

import { useAuthStore } from "@/store/authStore";
import { LoadingOverlay } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, accessToken } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Check if user is not authenticated
    if (!isAuthenticated || !accessToken) {
      router.replace("/auth");
    }
  }, [isAuthenticated, accessToken, router]);

  // Show loading while checking authentication
  if (!isAuthenticated || !accessToken) {
    return <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />;
  }

  return <>{children}</>;
}