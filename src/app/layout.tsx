import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PNGElectSys - Digital Electoral Transformation System",
  description: "Papua New Guinea Electoral Commission's Digital Transformation System featuring biometric voter registration, secure authentication, and real-time results transmission.",
  keywords: "PNG, Papua New Guinea, Electoral Commission, Biometric Registration, Digital Voting, Election Results",
  authors: [{ name: "Papua New Guinea Electoral Commission" }],
  openGraph: {
    title: "PNGElectSys - Digital Electoral Transformation System",
    description: "Papua New Guinea Electoral Commission's Digital Transformation System",
    type: "website",
  },
  robots: "noindex, nofollow", // Demo system
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#16a34a" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Register service worker for offline functionality
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }

              // Track online/offline status
              window.addEventListener('online', function() {
                console.log('Application is online');
                // You could show a toast notification here
              });

              window.addEventListener('offline', function() {
                console.log('Application is offline');
                // You could show a toast notification here
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
