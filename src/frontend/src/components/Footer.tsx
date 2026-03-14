import { Link } from "@tanstack/react-router";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <footer className="saffron-gradient text-white mt-auto">
      {/* Decorative divider */}
      <div className="text-center py-4 text-2xl tracking-widest opacity-60">
        🕉️ 🪷 🔔 🪷 🕉️
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <img
              src="/assets/uploads/605721043_17845109133653746_5579236318978443880_n-1.jpg"
              alt="Teerth Vaas"
              className="h-10 w-10 rounded-full object-cover border-2 border-gold-300"
            />
            <div>
              <div className="font-display font-bold text-lg">Teerth Vaas</div>
              <div className="text-xs text-white/70">
                Pilgrimage Stays, Peaceful Days
              </div>
            </div>
          </div>
          <p className="text-white/75 text-sm leading-relaxed">
            Your peaceful home in the divine land of Vrindavan. Serving pilgrims
            with devotion and care.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="font-display font-semibold text-gold-300 mb-3">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li>
              <Link to="/" className="hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/rooms" className="hover:text-white transition-colors">
                Our Rooms
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-white transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-display font-semibold text-gold-300 mb-3">
            Contact Us
          </h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li>📍 AD Omaxe Eternity, Vrindavan, UP</li>
            <li>
              <a href="tel:8181992992" className="hover:text-white">
                📞 8181992992
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/918181992992"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                💬 WhatsApp Us
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/20 py-4 text-center text-xs text-white/60">
        © {year} Teerth Vaas. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
          className="underline hover:text-white/80"
          target="_blank"
          rel="noopener noreferrer"
        >
          caffeine.ai
        </a>
      </div>
    </footer>
  );
}
