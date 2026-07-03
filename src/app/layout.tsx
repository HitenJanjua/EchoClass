import { Inter } from "next/font/google";
import AuthProvider from "./components/Authprovider";
import { ClassCacheProvider } from "./components/ClassCacheProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "EchoClass",
  description:
    "EchoClass — a modern classroom management platform for teachers and students.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body suppressHydrationWarning>
        <AuthProvider>
          <ClassCacheProvider>{children}</ClassCacheProvider>
        </AuthProvider>
      </body>
    </html>
  );
}