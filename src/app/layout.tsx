import type { Metadata, Route } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "Flex Living • Reviews Control Tower",
  description:
    "Manager dashboard to triage, approve, and publish guest reviews for every Flex Living property."
};

type RootLayoutProps = {
  children: React.ReactNode;
};

const navItems = [
  { href: "/" as Route, label: "Overview" },
  { href: "/dashboard" as Route, label: "Manager Dashboard" },
  { href: "/property/n1-loft" as Route, label: "Property Sample" }
];

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} bg-slate-50 text-slate-900 antialiased`}
      >
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-slate-200 bg-white/70 backdrop-blur-md sticky top-0 z-40">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-brand-500 text-white font-semibold flex items-center justify-center">
                  FL
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                    Flex Living
                  </p>
                  <p className="text-base font-semibold">
                    Reviews Control Tower
                  </p>
                </div>
              </Link>
              <nav className="flex items-center gap-4 text-sm font-medium">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-full border border-transparent px-4 py-2 text-slate-600 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="mt-10 border-t border-slate-200 bg-white">
            <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <p>© {new Date().getFullYear()} Flex Living - Internal Use</p>
              <p>
                Built for the Flex Living developer assessment
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

