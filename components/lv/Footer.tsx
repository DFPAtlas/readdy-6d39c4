'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Footer() {
  const [showCookieBanner, setShowCookieBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('lv_cookie_consent');
    if (!consent) {
      setShowCookieBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('lv_cookie_consent', 'essential');
    setShowCookieBanner(false);
  };

  return (
    <>
      {/* Ombudsman Banner */}
      <div className="bg-amber-50 border-y border-amber-200">
        <div className="px-4 py-4 lg:px-8 text-center">
          <p className="text-sm text-amber-900">
            Have a formal complaint?{' '}
            <span className="font-semibold">
              The Local Government and Social Care Ombudsman
            </span>{' '}
            investigates complaints councils haven&apos;t resolved{' '}
            <a
              href="https://www.lgo.org.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline text-[#0B5FFF] cursor-pointer"
            >
              lgo.org.uk
            </a>
          </p>
        </div>
      </div>

      {/* Main Footer */}
      <footer className="bg-slate-900 text-slate-300">
        <div className="px-4 py-12 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4 cursor-pointer">
                <div className="w-7 h-7 bg-[#0B5FFF] rounded-md flex items-center justify-center">
                  <i className="ri-government-line text-white text-sm" />
                </div>
                <span className="font-['Pacifico'] text-lg text-white">LocalVerdict</span>
              </Link>
              <p className="text-sm text-slate-400 leading-relaxed">
                Verified resident reviews for every UK local authority. Making councils accountable through transparency.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">
                Explore
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/councils" className="text-sm hover:text-white transition-colors cursor-pointer">
                    All councils
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-sm hover:text-white transition-colors cursor-pointer">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-sm hover:text-white transition-colors cursor-pointer">
                    About us
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-sm hover:text-white transition-colors cursor-pointer">
                    Help centre
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">
                Legal
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/legal/terms" className="text-sm hover:text-white transition-colors cursor-pointer">
                    Terms of use
                  </Link>
                </li>
                <li>
                  <Link href="/legal/privacy" className="text-sm hover:text-white transition-colors cursor-pointer">
                    Privacy policy
                  </Link>
                </li>
                <li>
                  <Link href="/legal/community-guidelines" className="text-sm hover:text-white transition-colors cursor-pointer">
                    Community guidelines
                  </Link>
                </li>
                <li>
                  <Link href="/legal/defamation-policy" className="text-sm hover:text-white transition-colors cursor-pointer">
                    Defamation policy
                  </Link>
                </li>
                <li>
                  <Link href="/legal/cookies" className="text-sm hover:text-white transition-colors cursor-pointer">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">
                Contact
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="mailto:hello@localverdict.co.uk"
                    className="text-sm hover:text-white transition-colors cursor-pointer"
                  >
                    hello@localverdict.co.uk
                  </a>
                </li>
                <li className="flex items-center gap-3 pt-2">
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-[#0B5FFF] transition-colors cursor-pointer"
                  >
                    <i className="ri-twitter-x-line text-sm" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-[#0B5FFF] transition-colors cursor-pointer"
                  >
                    <i className="ri-linkedin-fill text-sm" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              &copy; {new Date().getFullYear()} LocalVerdict. All rights reserved.
            </p>
            <p className="text-xs text-slate-500">
              Not an official government website. Independent resident review platform.
            </p>
          </div>
        </div>
      </footer>

      {/* Cookie Banner */}
      {showCookieBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-lg">
          <div className="px-4 py-4 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-sm text-slate-700">
              We use only essential cookies to keep you signed in and prevent abuse.{' '}
              <Link href="/legal/cookies" className="text-[#0B5FFF] hover:underline cursor-pointer">
                Learn more
              </Link>
            </p>
            <button
              onClick={acceptCookies}
              className="px-5 py-2 bg-[#0B5FFF] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}