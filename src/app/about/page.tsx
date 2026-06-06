'use client';

import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] py-12 px-4">
      <div className="mx-auto max-w-4xl space-y-12">
        {/* Header Section */}
        <section className="rounded-[2rem] border border-[var(--surface-border)] bg-[var(--surface)] p-8 shadow-[0_10px_30px_-10px_rgba(88,28,135,0.1)]">
          <div className="mb-8 inline-flex rounded-full bg-green-100/80 px-4 py-2 text-sm font-semibold text-[var(--accent-strong)] ring-1 ring-green-200/30">
            About Us
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-[var(--accent-strong)] sm:text-5xl">
            Wel's Flower Shop
          </h1>
          <p className="mt-4 text-lg text-[var(--foreground)]">
            Bringing elegance and joy through premium floral arrangements and personalized bouquets.
          </p>
        </section>

        {/* Business Details Section */}
        <section>
          <div className="rounded-[1.75rem] border border-[var(--surface-border)] bg-[var(--surface)] p-6 shadow-[0_8px_24px_-12px_rgba(88,28,135,0.08)]">
              <h2 className="text-xl font-semibold text-[var(--accent-strong)] mb-4">Business Registration</h2>
              <div className="space-y-4">
                <div className="pb-4 border-b border-[var(--surface-border)]">
                  <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">Registered Business Name</p>
                  <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                    {process.env.NEXT_PUBLIC_BUSINESS_NAME || "Wel's Flower Shop"}
                  </p>
                </div>

                <div className="pb-4 border-b border-[var(--surface-border)]">
                  <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">DTI Registration</p>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                      ✓ Registered
                    </span>
                </div>

                <div className="pb-4 border-b border-[var(--surface-border)]">
                  <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">BIR Registration</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                      ✓ Registered
                    </span>
                  </div>
                </div>

                <div className="pb-4 border-b border-[var(--surface-border)]">
                  <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">Business Permit</p>
                  <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                      ✓ Registered
                    </span>
                  </p>
                </div>

                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">Contact Information</p>
                  <div className="mt-3 space-y-2 text-[var(--foreground)]">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-[var(--accent)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <a href={`mailto:${process.env.NEXT_PUBLIC_EMAIL || 'welshop.flowers@gmail.com'}`} className="hover:text-[var(--accent)] transition">
                        {process.env.NEXT_PUBLIC_EMAIL || 'welshop.flowers@gmail.com'}
                      </a>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-[var(--accent)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <a href={`tel:${process.env.NEXT_PUBLIC_PHONE || '+63-XXX-XXX-XXXX'}`} className="hover:text-[var(--accent)] transition">
                        {process.env.NEXT_PUBLIC_PHONE || '+63-XXX-XXX-XXXX'}
                      </a>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-[var(--accent)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{process.env.NEXT_PUBLIC_ADDRESS || 'BLK 11 LOT 54 AMAIA SCAPES BARANDAL 4027 CITY OF CALAMBA LAGUNA PHILIPPINES'}</span>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </section>

        {/* Info Box */}
        <section className="rounded-[1.75rem] border border-green-200/50 bg-green-50/50 p-6">
          <p className="text-[var(--foreground)]">
            We are a legitimate, registered business committed to providing premium floral arrangements and exceptional customer service. All business operations comply with local regulations and requirements.
          </p>
        </section>

        {/* Full Width BIR Seal Badge Section */}
        <section className="rounded-[1.75rem] border border-[var(--surface-border)] bg-[var(--surface)] p-8 shadow-[0_8px_24px_-12px_rgba(88,28,135,0.08)]">
          <h3 className="text-lg font-semibold text-[var(--accent-strong)] mb-6 text-center">Official Registration</h3>
          
          {/* BIR Badge - Full Width */}
          <div className="relative w-full h-64 rounded-2xl border-2 border-[var(--surface-border)] overflow-hidden bg-green-50 flex items-center justify-center">
            <Image
              src={'/app/business_info/bir_registration_seal_badge.png'}
              alt="BIR Registration Seal"
              fill
              className="object-contain p-4"
            />
          </div>

          <p className="mt-4 text-sm text-gray-600 text-center">
            Bureau of Internal Revenue Registered Business
          </p>
        </section>
      </div>
    </div>
  );
}
