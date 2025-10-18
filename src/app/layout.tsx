import type { Metadata } from "next";

import "~/app/globals.css";
import { Providers } from "~/app/providers";
import { APP_NAME, APP_DESCRIPTION } from "~/lib/constants";

// Farcaster Mini App embed metadata
const miniAppEmbed = {
  version: "1",
  imageUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/og-image.png`,
  button: {
    title: "Start Battle",
    action: {
      type: "launch_frame" as const,
      name: APP_NAME,
      url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      splashImageUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/logo.png`,
      splashBackgroundColor: "#0f172a"
    }
  }
};

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  other: {
    "fc:miniapp": JSON.stringify(miniAppEmbed),
    "fc:frame": JSON.stringify(miniAppEmbed), // Backward compatibility
  },
  openGraph: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: [`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/og-image.png`],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="">
      <head>
        <meta name="color-scheme" content="light dark" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var root = document.documentElement;
                  // Force light mode if no theme is saved
                  if (!theme || theme === 'light') {
                    root.classList.remove('dark');
                    root.style.colorScheme = 'light';
                  } else if (theme === 'dark') {
                    root.classList.add('dark');
                    root.style.colorScheme = 'dark';
                  }
                } catch (e) {
                  // Default to light mode on error
                  document.documentElement.classList.remove('dark');
                  document.documentElement.style.colorScheme = 'light';
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
