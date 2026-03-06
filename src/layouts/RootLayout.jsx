import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../components/shared/Navbar/Navbar';
import Footer from '../components/shared/Footer/Footer';

const RootLayout = () => {
  return (
    <div>
      <Navbar />
      <main className="pt-24">
        <div className="px-4 md:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      <Footer></Footer>
    </div>
  );
};

export default RootLayout;