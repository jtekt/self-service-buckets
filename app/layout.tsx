import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme-provider";
import { LogoutButton } from "@/components/logout-button";
import { ModeToggle } from "@/components/toggle-mode";
import { HelpLink } from "@/components/help-link";
import { AppsLink } from "@/components/apps-link";
import { AppIcon } from "@/components/app-icon";
import Link from "next/link";
import { Toaster } from "sonner";
import { auth } from "@/auth";

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
  title: "Self-Service Buckets",
  description: "Self-service S3 buckets",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider>
      <html lang="en" className={inter.variable} suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <header className="flex h-12 items-center gap-2 border-b px-4">
              <Link
                href="/"
                className="mr-auto flex items-center gap-2 text-base font-semibold"
              >
                <AppIcon className="size-5 shrink-0" />
                Self-Service Buckets
              </Link>
              <ModeToggle />
              <AppsLink />
              <HelpLink />
              {session && <LogoutButton />}
            </header>

            <main className="mx-auto w-full max-w-3xl flex-1 p-4">
              {children}
            </main>

            <footer className="border-t p-4 text-center text-sm">
              Self-Service Buckets | JTEKT Corporation | {process.env.NEXT_PUBLIC_APP_VERSION ?? "dev"}
            </footer>
            <Toaster richColors />
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
