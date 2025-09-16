import "./globals.css";
import Providers from "./providers";
import NavBar from "./components/NavBar";

export const metadata = {
  title: "Spark",
  description: "CSUMB social media app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <Providers>
          <NavBar />
          <main className="mx-auto max-w-4xl p-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
