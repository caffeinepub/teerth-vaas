import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import type { Room } from "../backend";
import { useGetAllRooms } from "../hooks/useQueries";

const PLACEHOLDER_ROOMS = [
  {
    id: "standard",
    name: "Standard Room",
    description:
      "Peaceful single room with all essential amenities for the solo pilgrim.",
    pricePerNight: BigInt(2499),
    facilities: ["AC", "WiFi", "Private Bathroom", "Hot Water"],
    photos: [],
    placeholderImg: "/assets/generated/room-standard.dim_800x500.jpg",
  },
  {
    id: "couple",
    name: "Couple Room",
    description:
      "Comfortable double room ideal for couples and devotee pairs visiting Vrindavan.",
    pricePerNight: BigInt(2499),
    facilities: ["AC", "WiFi", "Private Bathroom", "Hot Water"],
    photos: [],
    placeholderImg: "/assets/generated/room-couple.dim_800x500.jpg",
  },
  {
    id: "family",
    name: "Family Room",
    description:
      "Spacious family room accommodating up to 4 members, perfect for family pilgrimages.",
    pricePerNight: BigInt(2499),
    facilities: ["AC", "WiFi", "Private Bathroom", "Hot Water"],
    photos: [],
    placeholderImg: "/assets/generated/room-family.dim_800x500.jpg",
  },
];

const PLACEHOLDERS_WITH_IMG: Record<string, string> = {
  standard: "/assets/generated/room-standard.dim_800x500.jpg",
  couple: "/assets/generated/room-couple.dim_800x500.jpg",
  family: "/assets/generated/room-family.dim_800x500.jpg",
};

function getRoomImage(room: Room): string {
  if (room.photos && room.photos.length > 0)
    return room.photos[0].getDirectURL();
  const key = room.id.toLowerCase();
  for (const k of Object.keys(PLACEHOLDERS_WITH_IMG)) {
    if (key.includes(k)) return PLACEHOLDERS_WITH_IMG[k];
  }
  return "/assets/generated/room-standard.dim_800x500.jpg";
}

const WHY_CARDS = [
  {
    icon: "🛕",
    title: "Near All Temples",
    desc: "Walking distance from Banke Bihari, ISKCON, Prem Mandir and major Vrindavan temples.",
  },
  {
    icon: "🥗",
    title: "Pure Veg Kitchen",
    desc: "Sattvic vegetarian meals and prasad available. No non-veg, alcohol or tobacco on premises.",
  },
  {
    icon: "🌸",
    title: "Peaceful Atmosphere",
    desc: "Spiritual environment with daily aarti, peaceful courtyards and devotional ambience.",
  },
  {
    icon: "🙏",
    title: "24/7 Service",
    desc: "Round the clock hospitality. Our seva team is always available to help you.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function HomePage() {
  const { data: rooms, isLoading } = useGetAllRooms();
  const displayRooms = rooms && rooms.length > 0 ? rooms.slice(0, 3) : null;

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[85vh] min-h-[520px] flex items-center justify-center overflow-hidden">
        <img
          src="/assets/generated/vrindavan-hero.dim_1400x700.jpg"
          alt="Vrindavan temples"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto"
        >
          <div className="text-3xl mb-4">🕉️</div>
          <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-4 drop-shadow-lg">
            Stay in the Divine Land of Vrindavan
          </h1>
          <p className="font-body text-lg md:text-xl text-white/85 mb-2 italic">
            Pavitra Teerthon Mein, Ghar Jaisa Vaas
          </p>
          <p className="font-body text-base text-white/70 mb-8">
            Peaceful spiritual stay near the sacred temples of Vrindavan
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/rooms">
              <Button
                data-ocid="home.book_now.primary_button"
                size="lg"
                className="bg-saffron-500 hover:bg-saffron-600 text-white font-body font-semibold px-8 py-3 rounded-full text-base shadow-saffron border-0"
              >
                🏠 Book Your Stay
              </Button>
            </Link>
            <a
              href="https://wa.me/918181992992"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/15 font-body font-semibold px-8 py-3 rounded-full text-base bg-transparent"
              >
                💬 WhatsApp Us
              </Button>
            </a>
          </div>
        </motion.div>
      </section>

      {/* Featured Rooms */}
      <section
        className="py-16 px-4 bg-accent/30 om-pattern"
        data-ocid="home.rooms.section"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="devotional-divider justify-center">
              <span className="font-body text-sm text-muted-foreground tracking-widest uppercase">
                Our Accommodations
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Comfortable Rooms for Every Pilgrim
            </h2>
            <p className="text-muted-foreground font-body max-w-xl mx-auto">
              Choose from our well-appointed rooms, each designed for your
              comfort and spiritual peace.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {isLoading
              ? ["s1", "s2", "s3"].map((k) => (
                  <Skeleton key={k} className="h-80 rounded-xl" />
                ))
              : (displayRooms || PLACEHOLDER_ROOMS).map((room, idx) => (
                  <motion.div
                    key={(room as { id?: string }).id || idx}
                    variants={itemVariants}
                    className="temple-card group cursor-pointer"
                    data-ocid={`rooms.item.${idx + 1}`}
                  >
                    <div className="overflow-hidden h-48">
                      <img
                        src={
                          (room as { placeholderImg?: string })
                            .placeholderImg || getRoomImage(room as Room)
                        }
                        alt={room.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-display font-bold text-lg text-foreground mb-1">
                        {room.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {room.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-display font-bold text-saffron-500 text-xl">
                          ₹{Number(room.pricePerNight).toLocaleString("en-IN")}
                          /night
                        </span>
                        <Link to="/rooms">
                          <Button
                            size="sm"
                            className="bg-saffron-500 hover:bg-saffron-600 text-white border-0 rounded-full text-xs"
                          >
                            View Rooms
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="devotional-divider justify-center">
              <span className="font-body text-sm text-muted-foreground tracking-widest uppercase">
                Why Stay With Us
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Pilgrimage Stays, Peaceful Days
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {WHY_CARDS.map((card) => (
              <motion.div
                key={card.title}
                variants={itemVariants}
                className="text-center p-6 rounded-xl bg-accent/40 border border-border hover:shadow-gold transition-all"
              >
                <div className="text-4xl mb-3">{card.icon}</div>
                <h3 className="font-display font-bold text-lg text-foreground mb-2">
                  {card.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tagline section */}
      <section className="py-16 px-4 saffron-gradient text-white text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-4xl mb-4 animate-float">🕉️</div>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            "Hare Krishna, Come Stay With Us"
          </h2>
          <p className="font-body text-lg text-white/85 mb-6">
            Thousands of pilgrims have found peace at Teerth Vaas. Begin your
            spiritual journey with a blessed, comfortable stay in the holy land
            of Vrindavan.
          </p>
          <div className="flex justify-center gap-8 mb-8 text-white/70 text-sm">
            <div className="text-center">
              <div className="font-display font-bold text-3xl text-white">
                500+
              </div>
              <div>Happy Pilgrims</div>
            </div>
            <div className="text-center">
              <div className="font-display font-bold text-3xl text-white">
                3
              </div>
              <div>Room Types</div>
            </div>
            <div className="text-center">
              <div className="font-display font-bold text-3xl text-white">
                24/7
              </div>
              <div>Service</div>
            </div>
          </div>
          <Link to="/contact">
            <Button
              size="lg"
              className="bg-white text-saffron-500 hover:bg-white/90 font-body font-bold px-8 rounded-full border-0"
            >
              📞 Book Now — Call 8181992992
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
