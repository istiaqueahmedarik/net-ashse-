'use client'
import { ConnectivityChecker } from "@/components/connectivity-checker";
import Image from "next/image";

import dynamic from "next/dynamic";

export default function Home() {

  return (
    <ConnectivityChecker />
  );
}
