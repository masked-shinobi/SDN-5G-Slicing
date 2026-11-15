import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";

export const metadata: Metadata = {
  title: "5G Network Slicing Dashboard | Open5GS & UERANSIM",
  description:
    "Interactive 5G Network Slicing Dashboard featuring eMBB & URLLC slice visualization, real-time subscriber control, signaling flow, and traffic testing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased text-foreground">
        <ThemeProvider defaultTheme="dark" storageKey="5g-slicing-theme">
          <div className="flex min-h-screen">
            {/* Left navigation sidebar */}
            <Sidebar />

            {/* Main content wrapper */}
            <div className="flex-1 flex flex-col min-w-0">
              <Header />
              <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
                {children}
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

