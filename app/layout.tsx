import type { Metadata } from 'next';
import { Toaster } from 'sonner';

import { ThemeProvider } from '@/components/theme-provider';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://synthara.is-a.dev'),
  title: "Synthara | AI-Powered Virtual Assistant",  
  description: "Meet Synthara—an intelligent, Next.js-powered AI assistant designed for seamless conversations and smart automation.",  
  icons: {
    icon: "/images/Synthara-Logo.png", // Path to your favicon
    shortcut: "/images/Synthara-Logo.png",
    apple: "/images/Synthara-Logo.png",
  },
  keywords: ["AI Assistant", "Next.js AI", "Synthara AI", "Smart Chatbot", "Real-time AI", "Vercel", "React"],  
  openGraph: {  
    title: "Synthara: Your AI Assistant for Smarter Conversations",  
    description: "Synthara is a powerful AI assistant built with Next.js 15, offering intuitive, real-time interactions for enhanced productivity.",  
    images: [{ url: "/opengraph-image.png" }], // Suggest a sleek AI-themed visual  
    url: "https://synthara.is-a.dev"  
  },  
  twitter: {  
    card: "summary_large_image",  
    title: "Synthara: The AI Assistant for a Smarter Future",  
    description: "AI-driven efficiency meets seamless interactions. Experience the future with Synthara.",  
    images: ["https://synthara.is-a.dev/twitter-image.png"]  
  },
  themeColor: "#0ea5e9", // A futuristic blue  
  viewport: "width=device-width, initial-scale=1"  
};

export const viewport = {
  maximumScale: 1, // Disable auto-zoom on mobile Safari
};

const LIGHT_THEME_COLOR = 'hsl(0 0% 100%)';
const DARK_THEME_COLOR = 'hsl(240deg 10% 3.92%)';
const THEME_COLOR_SCRIPT = `\
(function() {
  var html = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  function updateThemeColor() {
    var isDark = html.classList.contains('dark');
    meta.setAttribute('content', isDark ? '${DARK_THEME_COLOR}' : '${LIGHT_THEME_COLOR}');
  }
  var observer = new MutationObserver(updateThemeColor);
  observer.observe(html, { attributes: true, attributeFilter: ['class'] });
  updateThemeColor();
})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: THEME_COLOR_SCRIPT,
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster position="top-center" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
