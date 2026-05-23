import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/elements/header";
import { CartProvider } from "@/context/CartContext";
import CartSidebar from "@/components/elements/cart-sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wel's Flower Shop",
  description: "Premium custom bouquet and floral arrangements with elegant Microsoft Fluent-inspired styling.",
  verification: {
    google: "mdTJ0taVtBv3-85W-gYKP8ULumkOH_dCKVNfQYuYIro"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-100 min-h-screen`}
      >
        <CartProvider>
          <Header />
          <CartSidebar />
          <main className="min-h-screen pb-16">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
