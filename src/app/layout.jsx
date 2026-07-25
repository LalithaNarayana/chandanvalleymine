import { Playfair_Display, Inter } from "next/font/google";
import dbConnect from "../lib/db";
import Settings from "../models/Settings";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

async function getSiteSettings() {
  try {
    await dbConnect();
    const settings = await Settings.findOne().lean();
    return settings;
  } catch (e) {
    return null;
  }
}

export async function generateMetadata() {
  const settings = await getSiteSettings();
  const siteTitle = settings?.companyName || "Chandan Valley Farms";
  const metaTitle = settings?.seo?.metaTitle || `${siteTitle} | Premium Sandalwood Farm Plots`;
  const metaDescription =
    settings?.seo?.metaDescription ||
    "Invest in nature with professionally managed sandalwood plantations that deliver high long-term ROI and secure wealth growth.";
  const icon = settings?.favicon || settings?.logo || "/logo.png";

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: settings?.seo?.metaKeywords || undefined,
    icons: {
      icon,
      shortcut: icon,
      apple: icon,
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#FFFFFF] text-[#222222] font-inter">
        {children}
      </body>
    </html>
  );
}
