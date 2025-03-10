'use client';
import localFont from "next/font/local";
import "./globals.css";
import {CustomApiClient, CustomApiClientProvider} from "@/lib/services/api/CustomApiClientProvider";
import {API_BASE_URL} from "@/config/environments";
import { Toaster } from "@/components/ui/toaster"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
//
// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

const customClient = new CustomApiClient(API_BASE_URL);


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <CustomApiClientProvider value={customClient}>
          {/*<PageGuard  failRedirectUrl={"/login"}/>*/}
          {children}
        </CustomApiClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
