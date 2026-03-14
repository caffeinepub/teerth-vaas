import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useGetContactInfo, useSubmitEnquiry } from "../hooks/useQueries";

export default function ContactPage() {
  const { data: contactInfo } = useGetContactInfo();
  const submitEnquiry = useSubmitEnquiry();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const phone_ = contactInfo?.phone || "8181992992";
  const whatsapp_ = contactInfo?.whatsapp || "8181992992";
  const address_ =
    contactInfo?.address || "AD Omaxe Eternity, Vrindavan, Uttar Pradesh";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      await submitEnquiry.mutateAsync({ name, phone, message });
      setSubmitted(true);
      toast.success(
        "Your enquiry has been submitted! We'll contact you soon. 🙏",
      );
      setName("");
      setPhone("");
      setMessage("");
    } catch {
      toast.error("Failed to submit. Please call us directly.");
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="saffron-gradient text-white text-center py-14 px-4">
        <div className="text-3xl mb-2">📞</div>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
          Contact Us
        </h1>
        <p className="font-body text-white/80 text-lg">
          We're always here to help you plan your stay
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div>
            <div className="devotional-divider">
              <span className="text-muted-foreground font-body text-sm tracking-widest uppercase">
                Get In Touch
              </span>
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-1">
              Teerth Vaas, Vrindavan
            </h2>
            <p className="text-muted-foreground font-body text-sm">
              Pilgrimage Stays, Peaceful Days
            </p>
          </div>

          <div className="space-y-4">
            <a
              href={`tel:${phone_}`}
              className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:shadow-saffron transition-all group"
            >
              <div className="text-3xl">📞</div>
              <div>
                <div className="font-body font-semibold text-foreground">
                  {phone_}
                </div>
                <div className="text-muted-foreground text-xs">
                  Call us anytime
                </div>
              </div>
            </a>

            <a
              href={`https://wa.me/91${whatsapp_}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:shadow-gold transition-all"
            >
              <div className="text-3xl">💬</div>
              <div>
                <div className="font-body font-semibold text-foreground">
                  WhatsApp: {whatsapp_}
                </div>
                <div className="text-muted-foreground text-xs">
                  Quick booking via WhatsApp
                </div>
              </div>
            </a>

            <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl">
              <div className="text-3xl">📍</div>
              <div>
                <div className="font-body font-semibold text-foreground">
                  {address_}
                </div>
                <div className="text-muted-foreground text-xs">
                  Near Banke Bihari Mandir
                </div>
              </div>
            </div>
          </div>

          {/* Google Map */}
          <div
            className="rounded-xl overflow-hidden border border-border shadow-xs"
            data-ocid="contact.map_marker"
          >
            <iframe
              src="https://maps.google.com/maps?q=Omaxe+Eternity+Vrindavan&output=embed"
              width="100%"
              height="260"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Teerth Vaas Location"
            />
          </div>
        </motion.div>

        {/* Enquiry Form */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-card border border-border rounded-2xl p-6 shadow-md">
            <h3 className="font-display text-2xl font-bold text-foreground mb-1">
              Send an Enquiry
            </h3>
            <p className="text-muted-foreground font-body text-sm mb-6">
              We'll get back to you within 1 hour
            </p>

            {submitted ? (
              <div
                className="text-center py-8"
                data-ocid="contact.success_state"
              >
                <div className="text-5xl mb-3">🙏</div>
                <h4 className="font-display text-xl font-bold text-foreground mb-2">
                  Jai Shri Radhe!
                </h4>
                <p className="text-muted-foreground">
                  Your enquiry has been received. We'll reach you soon.
                </p>
                <button
                  type="button"
                  className="mt-4 text-saffron-500 font-body font-semibold text-sm hover:underline"
                  onClick={() => setSubmitted(false)}
                >
                  Send another enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="font-body text-sm text-foreground mb-1 block">
                    Your Name *
                  </Label>
                  <Input
                    data-ocid="contact.enquiry.input"
                    placeholder="Ram Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="font-body"
                  />
                </div>
                <div>
                  <Label className="font-body text-sm text-foreground mb-1 block">
                    Phone Number *
                  </Label>
                  <Input
                    data-ocid="contact.phone.input"
                    placeholder="9876543210"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="font-body"
                  />
                </div>
                <div>
                  <Label className="font-body text-sm text-foreground mb-1 block">
                    Message *
                  </Label>
                  <Textarea
                    data-ocid="contact.message.textarea"
                    placeholder="I'd like to book a room for 3 nights in November..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={4}
                    className="font-body resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  data-ocid="contact.enquiry.submit_button"
                  className="w-full bg-saffron-500 hover:bg-saffron-600 text-white font-body font-semibold rounded-full border-0"
                  disabled={submitEnquiry.isPending}
                >
                  {submitEnquiry.isPending ? "Sending..." : "🙏 Send Enquiry"}
                </Button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
