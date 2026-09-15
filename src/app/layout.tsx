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
    default: "EmprendeYa – La red de emprendimiento de Montería",
    template: "%s | EmprendeYa",
  },
  description:
    "EmprendeYa conecta emprendedores e inversores de Montería y la región Caribe. Publica tu proyecto, descubre convocatorias, eventos y cursos para hacer crecer tu negocio.",
  keywords: [
    "emprendimiento",
    "Montería",
    "inversión",
    "proyectos",
    "startups",
    "convocatorias",
    "eventos",
    "cursos",
    "emprendedores Colombia",
  ],
  authors: [{ name: "EmprendeYa" }],
  creator: "EmprendeYa",
  publisher: "EmprendeYa",
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
    siteName: "EmprendeYa",
    title: "EmprendeYa – La red de emprendimiento de Montería",
    description:
      "Conecta tus ideas con el éxito. La plataforma de emprendimiento e inversión de la región Caribe.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "EmprendeYa – Plataforma de Emprendimiento",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EmprendeYa – La red de emprendimiento de Montería",
    description:
      "Conecta tus ideas con el éxito. Proyectos, eventos, convocatorias y cursos para emprendedores.",
    images: ["/og-image.png"],
    creator: "@emprendeya",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f1a" },
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
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[9999] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold"
        >
          Saltar al contenido principal
        </a>
        {children}
      </body>
    </html>
  );
}
