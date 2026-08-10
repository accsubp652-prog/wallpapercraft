import './globals.css';

export const metadata = {
  title: 'WallpaperCraft | PWA & Marketplace',
  description: 'Descarga los mejores fondos de pantalla en alta resolución, HD y 4K.',
  manifest: '/manifest.json',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-[#090d16] text-slate-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}