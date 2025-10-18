"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { APP_NAME } from "~/lib/constants";

// note: dynamic import is required for components that use the Frame SDK
const SuperBattle = dynamic(() => import("~/components/SuperBattle"), {
  ssr: false,
});

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Signal that the app is ready to display (required for Farcaster)
        await sdk.actions.ready();
        setIsReady(true);
      } catch (error) {
        console.error("Failed to initialize Farcaster SDK:", error);
        // Fallback for non-Farcaster environments
        setIsReady(true);
      }
    };

    initializeApp();
  }, []);

  // Show nothing until SDK is ready (splash screen is shown by Farcaster)
  if (!isReady) {
    return null;
  }

  return <SuperBattle />;
}
