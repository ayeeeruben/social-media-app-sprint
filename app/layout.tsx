import "./globals.css";
import Providers from "./providers";
import NavBar from "./components/NavBar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // ✅ Always dark
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="bg-neutral-950 text-neutral-100">
        <Providers>
          <NavBar />
          <main className="mx-auto max-w-3xl p-4 sm:p-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}