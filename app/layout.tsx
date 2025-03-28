import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import NavBar from "./components/NavBar";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "RAEGERA - Learn German Nouns",
  description: "Master German nouns with personalized practice sessions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <NavBar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
