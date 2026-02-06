import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme-provider";
import { LogoutButton } from "@/components/logout-button";
import { ModeToggle } from "@/components/toggle-mode";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Self-service Bucket",
  description: "Self-service S3 buckets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en" className={inter.variable} suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col min-h-screen">
              <header className="w-full border-b p-2 flex items-center gap-2">
                <Link href="/" className="mr-auto text-2xl">
                  Self-service Buckets
                </Link>

                <ModeToggle />
                <LogoutButton />
              </header>

              <main className="max-w-3xl mx-auto w-full p-4 grow flex flex-col">
                {children}
              </main>

              <footer className="border-t text-center text-sm p-3">
                Self-service Buckets | JTEKT Corporation
              </footer>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
