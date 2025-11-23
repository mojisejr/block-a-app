import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Block A Race Estimator",
  description: "Calculate your perfect negative split race plan. Powered by Block A Running Club.",
  metadataBase: new URL("https://block-a-app.vercel.app"),
  openGraph: {
    title: "Block A Race Estimator",
    description: "Calculate your perfect negative split race plan. Powered by Block A Running Club.",
    siteName: "Block A Race Estimator",
    locale: "th_TH",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
