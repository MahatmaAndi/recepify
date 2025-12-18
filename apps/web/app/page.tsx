'use client';

import { useRouter } from "next/navigation";
import { LoginScreen } from "@/components/figma/LoginScreen";

export default function LandingPage() {
  const router = useRouter();
  return (
    <LoginScreen
      onSubmit={(payload) => {
        void payload;
        router.push("/home");
      }}
    />
  );
}
