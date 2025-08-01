
"use client";

import { useAuthStore } from "@/store/authStore";
import { LoadingOverlay } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated, accessToken } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      router.replace("/tasks");
    } else {
      router.replace("/auth");
    }
  }, [isAuthenticated, accessToken, router]);

  return <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />;
}
