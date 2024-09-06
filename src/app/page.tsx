'use client'
import { ConnectivityChecker } from "@/components/connectivity-checker";
import Image from "next/image";

import dynamic from "next/dynamic";
import { Suspense } from "react";

export default function Home() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConnectivityChecker />
    </Suspense>
  );
}
