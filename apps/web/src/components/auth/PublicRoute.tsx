"use client";

import { useAuthStore } from "@/store/authStore";
import { LoadingOverlay } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface PublicRouteProps {
  children: React.ReactNode;
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated, accessToken } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // If user is authenticated, redirect to tasks
    if (isAuthenticated && accessToken) {
      router.replace("/tasks");
    }
  }, [isAuthenticated, accessToken, router]);

  // Show loading while checking authentication
  if (isAuthenticated && accessToken) {
    return <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />;
  }

  return <>{children}</>;
}