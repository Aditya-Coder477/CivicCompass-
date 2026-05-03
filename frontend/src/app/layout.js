import './globals.css';

export const metadata = {
  title: 'CivicCompass — Your Guide to Every Vote',
  description: 'AI-assisted election guidance for Indian voters. Understand your election journey, find your booth, and vote with confidence.',
  keywords: 'election, voting, India, voter guide, ECI, election commission',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="animated-bg min-h-screen">{children}</body>
    </html>
  );
}
