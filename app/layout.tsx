import type { Metadata, Viewport } from "next";
import { Bangers, Rubik_Wet_Paint } from "next/font/google";
import "./globals.css";

const bangers = Bangers({
  variable: "--font-bangers",
  weight: "400",
  subsets: ["latin", "latin-ext"],
});

const wetPaint = Rubik_Wet_Paint({
  variable: "--font-wet-paint",
  weight: "400",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Úkolníček",
  description: "Jednoduchý úkolníček v komiksovém graffiti stylu. Úkoly se ukládají do prohlížeče.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="cs" className={`${bangers.variable} ${wetPaint.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
