"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageLoader } from "../../components/PageLoader";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Automically forwards to layout check which handles route protection
    router.push("/admin/dashboard");
  }, [router]);

  return <PageLoader />;
}
