import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://emprendeya.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "INNOVA LINK – Conectando Innovación y Crecimiento",
    template: "%s | INNOVA LINK",
  },
  description:
    "INNOVA LINK conecta emprendedores e inversores de Montería y la región. Publica tu proyecto, descubre convocatorias, eventos y cursos para hacer crecer tu negocio.",
  keywords: [
    "INNOVA LINK",
    "emprendimiento",
    "Montería",
    "inversión",
    "proyectos",
    "startups",
    "convocatorias",
    "eventos",
    "cursos",
    "innovación Colombia",
  ],
  authors: [{ name: "INNOVA LINK" }],
  creator: "INNOVA LINK",
  publisher: "INNOVA LINK",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: siteUrl,
    siteName: "INNOVA LINK",
    title: "INNOVA LINK – Conectando Innovación y Crecimiento",
    description:
      "Conecta tus ideas con el éxito. La plataforma de innovación y capital para emprendedores de la región.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "INNOVA LINK – Plataforma de Emprendimiento e Inversión",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "INNOVA LINK – Conectando Innovación y Crecimiento",
    description:
      "Plataforma de innovación, proyectos y capital para emprendedores.",
    images: ["/og-image.png"],
    creator: "@innovalink",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/innova-logo.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#447A00" },
    { media: "(prefers-color-scheme: dark)", color: "#0B1C24" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[9999] focus:bg-[#447A00] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold shadow-lg"
        >
          Saltar al contenido principal
        </a>
        {children}
      </body>
    </html>
  );
}
