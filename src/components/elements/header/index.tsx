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
    <header className="bg-header border-b border-slate-700/70 text-slate-100 py-4 relative">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4">
        <Link href="/" className="inline-flex items-center gap-3 rounded-3xl border border-slate-700/70 bg-slate-900/80 px-4 py-3 text-sm font-semibold text-slate-100 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.8)] transition hover:bg-slate-800">
          <Image
            src="/app/cropted_logo.png"
            alt="Logo"
            width={120}
            height={40}
            className="h-10 w-auto"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-4">
          {headerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800 hover:text-slate-50"
            >
              {link.title}
            </Link>
          ))}
        </nav>

        <button
          onClick={toggleMenu}
          className="md:hidden rounded-full border border-slate-700/70 bg-slate-900/80 p-3 text-slate-200 shadow-lg shadow-black/40"
          aria-label="Toggle menu"
        >
          <div className="w-6 space-y-1">
            <span className={`block h-0.5 w-full rounded-full bg-slate-200 transition ${isMenuOpen ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block h-0.5 w-full rounded-full bg-slate-200 transition ${isMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-full rounded-full bg-slate-200 transition ${isMenuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
          </div>
        </button>
      </div>

      <nav
        className={`md:hidden fixed inset-0 z-40 flex flex-col items-center justify-center bg-slate-950/95 p-8 backdrop-blur-xl transition-transform duration-300 ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button onClick={toggleMenu} className="absolute right-6 top-6 rounded-full border border-slate-700/70 bg-slate-900/80 p-3 text-slate-200">
          ×
        </button>
        <ul className="flex flex-col items-center gap-6 text-lg font-semibold text-slate-100">
          {headerLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} onClick={() => setIsMenuOpen(false)} className="hover:text-sky-300">
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}