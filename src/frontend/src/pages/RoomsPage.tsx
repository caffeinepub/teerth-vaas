import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import type { Room } from "../backend";
import { useGetAllRooms } from "../hooks/useQueries";

const FACILITY_ICONS: Record<string, string> = {
  AC: "❄️",
  WiFi: "📶",
  "Private Bathroom": "🚿",
  "Hot Water": "🔥",
};

const PLACEHOLDER_ROOMS: (Room & { placeholderImg: string })[] = [
  {
    id: "standard",
    name: "Standard Room",
    description:
      "A peaceful single room designed for the solo pilgrim. Clean, quiet and spiritually uplifting. All essential amenities for a comfortable stay near the holy temples of Vrindavan.",
    pricePerNight: BigInt(2499),
    facilities: ["AC", "WiFi", "Private Bathroom", "Hot Water"],
    photos: [],
    placeholderImg: "/assets/generated/room-standard.dim_800x500.jpg",
  },
  {
    id: "couple",
    name: "Couple Room",
    description:
      "A cozy double room ideal for couples and devotee pairs on pilgrimage. Warm, comfortable and blessed with a spiritual atmosphere — the perfect place to seek divine grace together.",
    pricePerNight: BigInt(2499),
    facilities: ["AC", "WiFi", "Private Bathroom", "Hot Water"],
    photos: [],
    placeholderImg: "/assets/generated/room-couple.dim_800x500.jpg",
  },
  {
    id: "family",
    name: "Family Room",
    description:
      "A spacious family room accommodating up to 4 members comfortably. Perfect for family pilgrimages to Vrindavan. Share the divine experience with your loved ones.",
    pricePerNight: BigInt(2499),
    facilities: ["AC", "WiFi", "Private Bathroom", "Hot Water"],
    photos: [],
    placeholderImg: "/assets/generated/room-family.dim_800x500.jpg",
  },
];

const PLACEHOLDER_IMGS: Record<string, string> = {
  standard: "/assets/generated/room-standard.dim_800x500.jpg",
  couple: "/assets/generated/room-couple.dim_800x500.jpg",
  family: "/assets/generated/room-family.dim_800x500.jpg",
};

function getRoomImage(room: Room): string {
  if (room.photos && room.photos.length > 0)
    return room.photos[0].getDirectURL();
  const key = room.id.toLowerCase();
  for (const k of Object.keys(PLACEHOLDER_IMGS)) {
    if (key.includes(k)) return PLACEHOLDER_IMGS[k];
  }
  return "/assets/generated/room-standard.dim_800x500.jpg";
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function RoomCard({
  room,
  imgSrc,
  index,
}: {
  room: Room & { placeholderImg?: string };
  imgSrc: string;
  index: number;
}) {
  const waLink = `https://wa.me/918181992992?text=I want to book ${encodeURIComponent(room.name)} at Teerth Vaas`;

  return (
    <motion.div
      variants={cardVariants}
      className="temple-card overflow-visible"
      data-ocid={`rooms.item.${index}`}
    >
      <div className="overflow-hidden h-56 rounded-t-lg">
        <img
          src={imgSrc}
          alt={room.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-display font-bold text-xl text-foreground">
            {room.name}
          </h3>
          <span className="font-display font-bold text-saffron-500 text-lg ml-2 whitespace-nowrap">
            ₹{Number(room.pricePerNight).toLocaleString("en-IN")}/night
          </span>
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          {room.description}
        </p>

        {/* Facilities */}
        <div className="flex flex-wrap gap-2 mb-5">
          {room.facilities.map((f) => (
            <Badge
              key={f}
              variant="secondary"
              className="bg-accent text-foreground border border-border text-xs font-body"
            >
              {FACILITY_ICONS[f] || "✓"} {f}
            </Badge>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button
              data-ocid={`rooms.book_now.button.${index}`}
              className="w-full bg-saffron-500 hover:bg-saffron-600 text-white font-body font-semibold rounded-full border-0"
            >
              🏠 Book Now
            </Button>
          </a>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button
              data-ocid={`rooms.whatsapp.button.${index}`}
              variant="outline"
              className="w-full border-green-500 text-green-700 hover:bg-green-50 font-body font-semibold rounded-full"
            >
              💬 WhatsApp
            </Button>
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function RoomsPage() {
  const { data: rooms, isLoading } = useGetAllRooms();
  const displayRooms = rooms && rooms.length > 0 ? rooms : null;

  return (
    <div className="min-h-screen bg-accent/20">
      {/* Page header */}
      <div className="saffron-gradient text-white text-center py-14 px-4">
        <div className="text-3xl mb-2">🛏️</div>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
          Our Rooms
        </h1>
        <p className="font-body text-white/80 text-lg">
          Comfortable stays for every pilgrim
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="devotional-divider mb-8">
          <span className="text-muted-foreground font-body text-sm tracking-widest">
            🕉️ Book via WhatsApp · Call 8181992992 🕉️
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {["sk1", "sk2", "sk3"].map((k) => (
              <Skeleton key={k} className="h-96 rounded-xl" />
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {(displayRooms || PLACEHOLDER_ROOMS).map((room, idx) => (
              <RoomCard
                key={(room as { id?: string }).id || idx}
                room={room as Room & { placeholderImg?: string }}
                imgSrc={
                  (room as { placeholderImg?: string }).placeholderImg ||
                  getRoomImage(room as Room)
                }
                index={idx + 1}
              />
            ))}
          </motion.div>
        )}

        {/* Contact CTA */}
        <div className="mt-12 text-center bg-saffron-50 border border-saffron-200 rounded-xl p-8">
          <h3 className="font-display text-2xl font-bold text-foreground mb-2">
            Need Help Booking?
          </h3>
          <p className="text-muted-foreground mb-4">
            Call or WhatsApp us — we reply fast!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="tel:8181992992">
              <Button className="bg-saffron-500 hover:bg-saffron-600 text-white border-0 rounded-full font-body font-semibold">
                📞 Call 8181992992
              </Button>
            </a>
            <a
              href="https://wa.me/918181992992"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="border-green-500 text-green-700 hover:bg-green-50 rounded-full font-body font-semibold"
              >
                💬 WhatsApp Us
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
