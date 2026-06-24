import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Vetta",
  description: "Performance Intelligence",
  icons: {
    icon: "/logo-simbolo.png",
    apple: "/logo-simbolo.png",
  },
  openGraph: {
    title: "Vetta",
    description: "Performance Intelligence",
    images: ["/logo-simbolo.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, padding: 0, background: "#F9F7F4" }}>
        {children}
      </body>
    </html>
  );
}