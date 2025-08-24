"use client";

import { headerLinks } from "@/common/constants/app";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-header text-white py-6 sm:py-4 relative min-h-[80px] flex items-center">
      {/* Logo/Image floating on the left */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
        <Image
          src="/app/cropted_logo.png"
          alt="Logo"
          width={120}
          height={30}
          className="h-10 sm:h-12 w-auto duration-300 hover:scale-110 drop-shadow-lg"
        />
      </div>

      {/* Burger Menu Button - Mobile Only */}
      <button
        onClick={toggleMenu}
        className="md:hidden absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-3"
        aria-label="Toggle menu"
      >
        <div className="w-7 h-7 flex flex-col justify-center items-center">
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              isMenuOpen ? "rotate-45 translate-y-1" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 mt-1 ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 mt-1 ${
              isMenuOpen ? "-rotate-45 -translate-y-1" : ""
            }`}
          ></span>
        </div>
      </button>

      {/* Desktop Navigation - Hidden on Mobile */}
      <nav className="hidden md:flex justify-center w-full">
        <ul className="flex space-x-8">
          {headerLinks.map((link) => (
            <li key={link}>
              <Link href={link} className="hover:text-gray-300 transition-colors">
                {link}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Navigation Menu */}
      <nav
        className={`md:hidden fixed top-0 left-0 w-full h-screen bg-header z-10 transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <ul className="flex flex-col space-y-8 text-center">
            {headerLinks.map((link) => (
              <li key={link}>
                <Link
                  href={link}
                  className="text-xl hover:text-gray-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}