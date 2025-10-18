"use client";

import dynamic from "next/dynamic";
import { MiniAppProvider } from "@neynar/react";
import { ThemeProvider } from "~/components/providers/ThemeProvider";

const WagmiProvider = dynamic(
  () => import("~/components/providers/WagmiProvider"),
  {
    ssr: false,
  }
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <WagmiProvider>
        <MiniAppProvider analyticsEnabled={true}>{children}</MiniAppProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}
