'use client'
import Image from "next/image";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const ConnectivityChecker = dynamic(() => import("@/components/connectivity-checker"), {
  ssr: false,
});

export default function Home() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConnectivityChecker />
    </Suspense>
  );
}
