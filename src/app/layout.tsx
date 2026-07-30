import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloatButton from "@/components/WhatsAppFloatButton";
import ScrollReveal from "@/components/ScrollReveal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const siteDescription =
  "Ajudamos mães a lidar com desafios de comportamento infantil em casa e na escola, com aulas e acompanhamento de professoras especializadas. Fale conosco pelo WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Crianças em Foco | Apoio para mães e professoras especializadas",
    template: "%s | Crianças em Foco",
  },
  description: siteDescription,
  keywords: [
    "comportamento infantil",
    "aulas para crianças",
    "professora especializada",
    "TDAH",
    "TEA",
    "birras",
    "apoio para mães",
  ],
  openGraph: {
    title: "Crianças em Foco",
    description: siteDescription,
    url: siteUrl,
    siteName: "Crianças em Foco",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crianças em Foco",
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-cream text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloatButton />
        <ScrollReveal />
      </body>
    </html>
  );
}
