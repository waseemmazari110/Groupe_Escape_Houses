import Link from "next/link";
import { Instagram, Facebook, Twitter, Youtube, Linkedin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] pt-16 pb-8">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Logo and Tagline */}
            <div className="col-span-1">
              <h3
                className="text-2xl mb-4"
                style={{ fontFamily: "var(--font-display)", color: "var(--color-accent-gold)" }}
              >
                Group Escape Houses
              </h3>
              <p className="text-sm text-[var(--color-bg-secondary)] leading-relaxed mb-4">
                Exceptional large group accommodation across the UK with premium facilities and outstanding service.
              </p>
            <Link href="/our-story" className="text-sm hover:text-[var(--color-accent-sage)] transition-colors">
              Read our story →
            </Link>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/properties" className="hover:text-[var(--color-accent-sage)] transition-colors">
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link href="/experiences" className="hover:text-[var(--color-accent-sage)] transition-colors">
                  Activities & Services
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="hover:text-[var(--color-accent-sage)] transition-colors">
                  UK Destinations
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-[var(--color-accent-sage)] transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-[var(--color-accent-sage)] transition-colors">
                  Guest Reviews
                </Link>
              </li>
                <li>
                  <Link href="/inspiration" className="hover:text-[var(--color-accent-sage)] transition-colors">
                    Inspiration
                  </Link>
                </li>
                <li>
                  <Link href="/guides" className="hover:text-[var(--color-accent-sage)] transition-colors">
                    Guides & Resources
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[var(--color-accent-sage)] transition-colors">
                    Contact & Enquiries
                  </Link>
                </li>
                <li>
                  <a href="https://butlersinthebuff.co.uk/" className="hover:text-[var(--color-accent-sage)] transition-colors">
                    Butlers in the Buff UK
                  </a>
                </li>
                <li>
                  <a href="https://butlerswithbums.com/" className="hover:text-[var(--color-accent-sage)] transition-colors">
                    Butlers with Bums
                  </a>
                </li>
              </ul>
            </div>

            {/* Property Owners */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Property Owners</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/why-list-with-escape-houses" className="hover:text-[var(--color-accent-sage)] transition-colors">
                    Why List With Us?
                  </Link>
                </li>
                <li>
                  <Link href="/advertise-with-us" className="hover:text-[var(--color-accent-sage)] transition-colors">
                    List Your Property
                  </Link>
                </li>
                <li>
                  <Link href="/advertise-with-us#pricing" className="hover:text-[var(--color-accent-sage)] transition-colors">
                    Fixed Fee Pricing
                  </Link>
                </li>
                  <li>
                    <Link href="/login" className="hover:text-[var(--color-accent-sage)] transition-colors">
                      Customer Login
                    </Link>
                  </li>
                  <li>
                    <Link href="/owner-login" className="hover:text-[var(--color-accent-sage)] transition-colors">
                      Owner Login
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/properties" className="hover:text-[var(--color-accent-sage)] transition-colors">
                      Owner Dashboard
                    </Link>
                  </li>
              </ul>
            </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Contact Us</h4>
            <ul className="space-y-3 text-sm text-[var(--color-bg-secondary)]">
              <li>Office, 11a North Street</li>
              <li>Brighton</li>
              <li>BN41 1DH</li>
              <li className="pt-2">
                <a
                  href="tel:+441273569301"
                  className="hover:text-[var(--color-accent-sage)] transition-colors flex items-center gap-2 font-medium"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>01273 569301</span>
                </a>
              </li>
                <li>
                  <a
                    href="mailto:hello@groupescapehouses.co.uk"
                    className="hover:text-[var(--color-accent-sage)] transition-colors block"
                  >
                    hello@groupescapehouses.co.uk
                  </a>
                </li>

            </ul>
          </div>

            {/* Social */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Follow Us</h4>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.instagram.com/groupescapehouses/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-full bg-[var(--color-accent-sage)] flex items-center justify-center hover:-translate-y-1 hover:bg-[var(--color-accent-gold)] transition-all duration-200"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="w-6 h-6 text-white" />
                </a>
                <a
                  href="https://www.tiktok.com/@groupescapehouses"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-full bg-[var(--color-accent-sage)] flex items-center justify-center hover:-translate-y-1 hover:bg-[var(--color-accent-gold)] transition-all duration-200"
                  aria-label="Follow us on TikTok"
                >
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/@GroupEscapeHouses"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-full bg-[var(--color-accent-sage)] flex items-center justify-center hover:-translate-y-1 hover:bg-[var(--color-accent-gold)] transition-all duration-200"
                  aria-label="Subscribe on YouTube"
                >
                  <Youtube className="w-6 h-6 text-white" />
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61580927195664"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-full bg-[var(--color-accent-sage)] flex items-center justify-center hover:-translate-y-1 hover:bg-[var(--color-accent-gold)] transition-all duration-200"
                  aria-label="Follow us on Facebook"
                >
                  <Facebook className="w-6 h-6 text-white" />
                </a>
                <a
                  href="https://www.pinterest.com/groupescapehouses"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-full bg-[var(--color-accent-sage)] flex items-center justify-center hover:-translate-y-1 hover:bg-[var(--color-accent-gold)] transition-all duration-200"
                  aria-label="Follow us on Pinterest"
                >
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0a12 12 0 0 0-4.37 23.17c-.18-1.56-.03-3.45.4-5.15l3.1-13.14a5.72 5.72 0 0 1-.21-1.81 3.94 3.94 0 0 1 4.09-3.91c1.93 0 2.86 1.45 2.86 3.18a20.64 20.64 0 0 1-1.15 4.46c-.33 1.38.69 2.5 2.05 2.5 2.47 0 4.13-3.17 4.13-6.93 0-2.86-1.93-5-5.44-5a6.32 6.32 0 0 0-6.6 6.36 3.78 3.78 0 0 0 .72 2.21.37.37 0 0 1 .08.35c-.09.39-.3 1.23-.34 1.4a.28.28 0 0 1-.4.2c-1.55-.63-2.27-2.33-2.27-4.24 0-3.15 2.65-6.93 7.9-6.93 4.23 0 7 3.07 7 6.39 0 4.38-2.44 7.66-6.05 7.66a3.28 3.28 0 0 1-2.8-1.42l-.77 3a11.4 11.4 0 0 1-1.31 2.72A12 12 0 1 0 12 0z"/>
                  </svg>
                </a>
              </div>
            </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[var(--color-accent-gold)] opacity-30 mb-8"></div>

          {/* Bottom Bar */}
          <div className="border-t border-[var(--color-accent-gold)] opacity-30 mb-8 pt-8 text-center max-w-4xl mx-auto">
            <p className="text-xs text-[var(--color-bg-secondary)] mb-6 italic">
              Group Escape Houses is an advertising platform. Bookings, payments and contracts are handled directly between guests and property owners.
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[var(--color-bg-secondary)]">
          <p>&copy; 2025 Group Escape Houses. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/terms" className="hover:text-[var(--color-accent-sage)] transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/booking-terms" className="hover:text-[var(--color-accent-sage)] transition-colors">
              Booking Terms
            </Link>
            <Link href="/privacy" className="hover:text-[var(--color-accent-sage)] transition-colors">
              Privacy & GDPR
            </Link>
            <Link href="/our-story" className="hover:text-[var(--color-accent-sage)] transition-colors">
              Our Story
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}