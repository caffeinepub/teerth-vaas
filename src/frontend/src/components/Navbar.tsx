import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home", ocid: "nav.home.link" },
    { to: "/rooms", label: "Rooms", ocid: "nav.rooms.link" },
    { to: "/about", label: "About", ocid: "nav.about.link" },
    { to: "/contact", label: "Contact", ocid: "nav.contact.link" },
  ];

  return (
    <header className="sticky top-0 z-50 saffron-gradient shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/assets/uploads/605721043_17845109133653746_5579236318978443880_n-1.jpg"
            alt="Teerth Vaas Logo"
            className="h-12 w-12 rounded-full object-cover border-2 border-gold-300"
          />
          <div className="leading-tight">
            <div className="font-display font-bold text-xl text-white leading-none">
              Teerth Vaas
            </div>
            <div className="text-xs text-white/80 font-body">
              Vrindavan Guest House
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              data-ocid={link.ocid}
              className="text-white/90 hover:text-white font-body font-medium text-sm transition-colors relative group"
              activeProps={{ className: "text-white font-semibold" }}
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-300 transition-all group-hover:w-full" />
            </Link>
          ))}
          <a
            href="tel:8181992992"
            className="bg-white/15 hover:bg-white/25 text-white font-body font-semibold text-sm px-4 py-2 rounded-full border border-white/30 transition-all"
          >
            📞 8181992992
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden text-white p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden md:hidden border-t border-white/20"
          >
            <nav className="flex flex-col px-4 py-4 gap-3 bg-saffron-600">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  data-ocid={link.ocid}
                  className="text-white font-body font-medium text-base py-2 border-b border-white/10 last:border-0"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="tel:8181992992"
                className="text-white font-body font-semibold text-base py-2"
              >
                📞 8181992992
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
