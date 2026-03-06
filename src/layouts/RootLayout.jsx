import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../components/shared/Navbar/Navbar';

const RootLayout = () => {
  return (
    <div>
      <Navbar />
      <main className="pt-24">
        <div className="px-4 md:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default RootLayout;