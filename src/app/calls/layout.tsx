'use client';


import PageGuard from "@/security/page-guard";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <PageGuard  failRedirectUrl={"/login"}/>
            {children}
        </>
    );
}
