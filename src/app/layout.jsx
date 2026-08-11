import Navbar from '@/components/Navbar';
import './globals.css';

export const metadata = {
  title: 'WallpaperCraft',
  description: 'Plataforma de fondos de pantalla en alta resolución',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-neutral-950 text-white antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}