import { useEffect, useState } from 'react';

export default function Aside() {
  const [currentPath, setCurrentPath] = useState('');

  const sidebarMenu = [
    { src: '/icons/home.png', alt: 'Home', path: '/home' },
    { src: '/icons/catatan.png', alt: 'Catatan', path: '/catatan' },
    { src: '/icons/jurnal.png', alt: 'Jurnal', path: '/jurnal' },
    { src: '/icons/refleksi.png', alt: 'Refleksi Diri', path: '/refleksi' },
  ];

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  return (
    <aside className="hidden bg-black md:flex w-20 text-white flex-col items-center py-6 space-y-6 rounded-xl m-4">
      {sidebarMenu.map((item, index) => {
        const isActive = currentPath === item.path;

        return (
          <a
            key={index}
            href={item.path}
            className={`p-2 rounded-lg transition duration-200 cursor-pointer ${
              isActive ? 'bg-purple-300' : 'hover:bg-purple-300'
            }`}
          >
            <img src={item.src} alt={item.alt} className="w-8 h-8" />
          </a>
        );
      })}
    </aside>
  );
}
