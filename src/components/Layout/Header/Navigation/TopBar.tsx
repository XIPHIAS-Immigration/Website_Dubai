'use client';

import * as React from 'react';
import Link from 'next/link';
import { Phone, Mail, Globe, LogIn, MessageCircle } from 'lucide-react';
import GlobalSearch from '@/components/GlobalSearch';

const PHONE_DISPLAY = '+971 52 727 5101';
const PHONE_TEL = '+971527275101';
const WHATSAPP_URL = 'https://wa.me/971527275101';
const EMAIL = 'dubai@xiphiasimmigration.com';

const pill =
  'group flex items-center gap-1.5 text-[#eef3fb]/70 hover:text-[#eef3fb] transition-colors duration-150';
const icon =
  'inline-flex h-[22px] w-[22px] items-center justify-center rounded-full bg-gold/90 text-[#0a1733] shrink-0 group-hover:bg-gold transition-colors duration-150';

export default function TopBar() {
  return (
    <div className="hidden lg:block bg-[#0a1733] border-b border-gold/30">
      <div className="mx-auto max-w-screen-2xl px-4">
        <div
          className="flex items-center justify-between py-2 px-0 text-[12.5px] leading-6 text-[#eef3fb]"
        >
          {/* Left — inline contact info */}
          <div className="flex items-center gap-3">
            <a
              href={`tel:${PHONE_TEL}`}
              aria-label={`Call ${PHONE_DISPLAY}`}
              className={pill}
            >
              <span className={icon}>
                <Phone className="h-3 w-3" aria-hidden />
              </span>
              <span className="font-medium tracking-wide">{PHONE_DISPLAY}</span>
            </a>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Chat with us on WhatsApp at ${PHONE_DISPLAY}`}
              title="WhatsApp us"
              className={pill}
            >
              <span className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#25D366] text-white shrink-0 group-hover:bg-[#1ebe5b] transition-colors duration-150">
                <MessageCircle className="h-3 w-3" aria-hidden />
              </span>
              <span className="font-medium tracking-wide">WhatsApp</span>
            </a>

            <span className="h-4 w-px bg-gold/25" aria-hidden />

            <a
              href={`mailto:${EMAIL}`}
              aria-label={`Email ${EMAIL}`}
              className={pill}
            >
              <span className={icon}>
                <Mail className="h-3 w-3" aria-hidden />
              </span>
              <span className="font-medium tracking-wide">{EMAIL}</span>
            </a>
          </div>

          {/* Right — actions */}
          <div className="flex items-center gap-2.5">

            {/* Compact search icon */}
            <GlobalSearch compact />

            <span className="h-4 w-px bg-gold/25" aria-hidden />

            {/* Passport Power */}
            <Link
              href="/passport-index"
              className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1.5 text-[12px] font-bold text-[#0a1733] ring-1 ring-gold/30 hover:bg-gold_bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 transition-colors duration-150"
            >
              <Globe className="h-3.5 w-3.5 shrink-0" aria-hidden />
              Passport Power
            </Link>

            {/* Login icon */}
            <Link
              href="https://www.xiphiasimmigration.com/XIPHIAS/Account/Login"
              aria-label="Sign in to X-Hub"
              title="X-Hub Login"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gold/10 text-[#eef3fb] ring-1 ring-gold/20 hover:bg-gold/20 hover:ring-gold/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 transition-colors duration-150"
            >
              <LogIn className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
