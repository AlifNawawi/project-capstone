import React from 'react';
import ProfileWeb from './profile-web';

const Header = ({ title, setIsSidebarOpen }) => {
  return (
    <header className="bg-purple-300 px-4 py-3 md:px-6 md:py-4 flex justify-between items-center rounded-xl mx-2 md:mx-4 mt-2 md:mt-4 shadow-md">
      <div className="flex items-center space-x-2 md:space-x-3">
        <img src="/logo.png" alt="Logo" className="w-6 h-6 md:w-8 md:h-8" />
        <h1 className="text-lg md:text-xl font-bold">{title}</h1>
      </div>
      <div className="flex items-center space-x-2 md:space-x-3">
        <ProfileWeb />
        <button
          className="md:hidden p-2"
          onClick={() => setIsSidebarOpen(true)}
        >
          <img
            src="/icons/menu.png"
            alt="Menu"
            className="w-5 h-5 md:w-6 md:h-6"
          />
        </button>
      </div>
    </header>
  );
};

export default Header;
