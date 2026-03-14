import { motion } from "motion/react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const TEMPLES = [
  { name: "Banke Bihari Mandir", distance: "5 min walk" },
  { name: "ISKCON Temple", distance: "10 min walk" },
  { name: "Prem Mandir", distance: "15 min drive" },
  { name: "Nidhivan", distance: "7 min walk" },
  { name: "Radha Damodar Mandir", distance: "8 min walk" },
  { name: "Seva Kunj", distance: "6 min walk" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="saffron-gradient text-white text-center py-14 px-4">
        <div className="text-3xl mb-2">🕉️</div>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
          Our Story
        </h1>
        <p className="font-body text-white/80 text-lg">
          Born from devotion, built for pilgrims
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-10"
        >
          {/* Main story */}
          <motion.div
            variants={itemVariants}
            className="grid md:grid-cols-2 gap-8 items-center"
          >
            <div>
              <div className="devotional-divider">
                <span className="text-muted-foreground font-body text-sm tracking-widest uppercase">
                  About Teerth Vaas
                </span>
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                A Home in the Holy Land of Vrindavan
              </h2>
              <p className="font-body text-muted-foreground leading-relaxed mb-4">
                Teerth Vaas was founded with one simple vision — to provide
                pilgrims visiting the sacred city of Vrindavan with a clean,
                peaceful and homely place to rest. Located at AD Omaxe Eternity
                in the heart of Vrindavan, we are your gateway to the divine.
              </p>
              <p className="font-body text-muted-foreground leading-relaxed">
                Our name says it all: "Teerth" means pilgrimage, and "Vaas"
                means home. Here, every guest is treated as a devotee deserving
                of warm hospitality, sattvic food and spiritual peace.
              </p>
            </div>
            <div className="rounded-xl overflow-hidden shadow-gold">
              <img
                src="/assets/generated/vrindavan-hero.dim_1400x700.jpg"
                alt="Vrindavan temples"
                className="w-full h-64 object-cover"
              />
            </div>
          </motion.div>

          {/* Spiritual atmosphere */}
          <motion.div
            variants={itemVariants}
            className="bg-accent/40 rounded-2xl p-8 border border-border"
          >
            <h3 className="font-display text-2xl font-bold text-foreground mb-4 text-center">
              🌸 Spiritual Atmosphere
            </h3>
            <p className="font-body text-muted-foreground leading-relaxed text-center max-w-2xl mx-auto">
              At Teerth Vaas, the spiritual energy of Vrindavan fills every
              corner. Wake up to the sound of temple bells and morning bhajans.
              Our property maintains a pure, sattvic environment — no
              non-vegetarian food, no alcohol, no tobacco. Just peace, devotion
              and the divine grace of Radha Krishna.
            </p>
          </motion.div>

          {/* Nearby temples */}
          <motion.div variants={itemVariants}>
            <h3 className="font-display text-2xl font-bold text-foreground mb-6 text-center">
              🛕 Nearby Sacred Temples
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {TEMPLES.map((t) => (
                <div
                  key={t.name}
                  className="flex flex-col items-center text-center p-4 bg-card border border-border rounded-xl hover:shadow-gold transition-all"
                >
                  <span className="text-2xl mb-1">🛕</span>
                  <span className="font-body font-semibold text-foreground text-sm">
                    {t.name}
                  </span>
                  <span className="text-muted-foreground text-xs mt-1">
                    {t.distance}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Values */}
          <motion.div
            variants={itemVariants}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: "🧹",
                title: "Cleanliness",
                desc: "Daily housekeeping, fresh linens, sparkling bathrooms — cleanliness is our devotion.",
              },
              {
                icon: "🙏",
                title: "Hospitality",
                desc: "Every guest is treated as a divine visitor. Atithi Devo Bhava is our guiding principle.",
              },
              {
                icon: "🌿",
                title: "Simplicity",
                desc: "Simple, honest, affordable. We provide everything you need and nothing you don't.",
              },
            ].map((v) => (
              <div
                key={v.title}
                className="text-center p-6 bg-card border border-border rounded-xl"
              >
                <div className="text-3xl mb-2">{v.icon}</div>
                <h4 className="font-display font-bold text-lg text-foreground mb-2">
                  {v.title}
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div variants={itemVariants} className="text-center py-6">
            <div className="text-3xl mb-3">🪷</div>
            <h3 className="font-display text-2xl font-bold text-foreground mb-2">
              Come, Rest, Pray
            </h3>
            <p className="text-muted-foreground font-body mb-4">
              Reach out to us and we'll help you plan your pilgrimage stay.
            </p>
            <a href="tel:8181992992">
              <span className="inline-block bg-saffron-500 hover:bg-saffron-600 text-white font-body font-semibold px-8 py-3 rounded-full transition-colors cursor-pointer">
                📞 Call Now: 8181992992
              </span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
