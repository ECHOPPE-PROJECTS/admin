import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderSection from "@/components/header_setion";
import Sidebar from "@/components/Sidebar";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Echoppe Admin",
  description: "Interface d'administration des incidents et des utilisateurs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning={true} className="min-h-full flex flex-col">
        <Providers>
          <div className="h-screen flex overflow-hidden">
            <Sidebar />
            <div className="flex flex-col w-0 flex-1 overflow-auto">
              <div className="mx-auto max-w-7xl w-full">
                <HeaderSection />
                <main>{children}</main>
              </div>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
