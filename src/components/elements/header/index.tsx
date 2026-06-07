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
    <header className="bg-[var(--surface)] border-b border-[var(--surface-border)] text-[var(--foreground)] py-4 relative">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4">
        <Link href="/" className="inline-flex items-center gap-3 rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)] px-4 py-3 text-sm font-semibold text-[var(--accent-strong)] shadow-[0_10px_30px_-20px_rgba(31,58,94,0.15)] transition hover:bg-[var(--surface-muted)]">
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
              className="rounded-full px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--accent-strong)]"
            >
              {link.title}
            </Link>
          ))}
        </nav>

        <button
          onClick={toggleMenu}
          className="md:hidden rounded-full border border-[var(--surface-border)] bg-[var(--surface-muted)] p-3 text-[var(--foreground)] shadow-lg shadow-[rgba(31,58,94,0.12)]"
          aria-label="Toggle menu"
        >
          <div className="w-6 space-y-1">
            <span className={`block h-0.5 w-full rounded-full bg-[var(--foreground)] transition ${isMenuOpen ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block h-0.5 w-full rounded-full bg-[var(--foreground)] transition ${isMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-full rounded-full bg-[var(--foreground)] transition ${isMenuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
          </div>
        </button>
      </div>

      <nav
        className={`md:hidden fixed inset-0 z-40 flex flex-col items-center justify-center bg-[var(--surface)]/95 p-8 backdrop-blur-xl transition-transform duration-300 ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button onClick={toggleMenu} className="absolute right-6 top-6 rounded-full border border-[var(--surface-border)] bg-[var(--surface-muted)] p-3 text-[var(--foreground)]">
          ×
        </button>
        <ul className="flex flex-col items-center gap-6 text-lg font-semibold text-[var(--accent-strong)]">
          {headerLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} onClick={() => setIsMenuOpen(false)} className="hover:text-[var(--accent)]">
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}