import type { Metadata } from 'next';
import { Toaster } from 'sonner';

import { ThemeProvider } from '@/components/theme-provider';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://auroraai.vercel.app'),
  title: "AuroraAI | Next.js-Powered AI Assistant",  
  description: "Illuminate your ideas with AuroraAI—a modern, Next.js chatbot blending AI brilliance and Northern Lights elegance.",  
  keywords: ["AI Assistant", "Next.js Chatbot", "Northern Lights AI", "Real-time AI", "Vercel", "React"],  
  openGraph: {  
    title: "AuroraAI: Conversations as Bright as the Aurora",  
    description: "A Next.js 15 chatbot inspired by the Northern Lights—fast, intuitive, and endlessly helpful.",  
    images: [{ url: "/opengraph-image.png" }], // Suggest aurora-themed visuals  
    url: "https://auroraai.vercel.app"  
  },  
  twitter: {  
    card: "summary_large_image",  
    title: "Meet AuroraAI: Your Luminous Next.js Assistant",  
    description: "Powered by Next.js, glowing with intelligence. ✨",  
    images: ["https://https://auroraai.vercel.app/twitter-image.png"]  
  },
  themeColor: "#4f46e5", // Deep indigo (aurora-inspired)  
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
      // `next-themes` injects an extra classname to the body element to avoid
      // visual flicker before hydration. Hence the `suppressHydrationWarning`
      // prop is necessary to avoid the React hydration mismatch warning.
      // https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app
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
          defaultTheme="system"
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
