import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import type { Room } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddRoom,
  useDeleteRoom,
  useGetAllEnquiries,
  useGetAllRooms,
  useGetContactInfo,
  useIsAdmin,
  useUpdateContactInfo,
  useUpdateRoom,
  useUploadRoomPhoto,
} from "../hooks/useQueries";

const ALL_FACILITIES = [
  "AC",
  "WiFi",
  "Private Bathroom",
  "Hot Water",
  "TV",
  "Geyser",
  "Parking",
];

type RoomFormData = {
  name: string;
  description: string;
  pricePerNight: string;
  facilities: string[];
};

const DEFAULT_FORM: RoomFormData = {
  name: "",
  description: "",
  pricePerNight: "2499",
  facilities: ["AC", "WiFi", "Private Bathroom", "Hot Water"],
};

function RoomsTab() {
  const { data: rooms, isLoading } = useGetAllRooms();
  const addRoom = useAddRoom();
  const updateRoom = useUpdateRoom();
  const deleteRoom = useDeleteRoom();
  const uploadPhoto = useUploadRoomPhoto();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [form, setForm] = useState<RoomFormData>(DEFAULT_FORM);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  function toggleFacility(f: string) {
    setForm((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(f)
        ? prev.facilities.filter((x) => x !== f)
        : [...prev.facilities, f],
    }));
  }

  function startEdit(room: Room) {
    setEditingRoom(room);
    setForm({
      name: room.name,
      description: room.description,
      pricePerNight: String(Number(room.pricePerNight)),
      facilities: [...room.facilities],
    });
    setShowAddForm(false);
  }

  function resetForm() {
    setForm(DEFAULT_FORM);
    setEditingRoom(null);
    setShowAddForm(false);
    setPhotoFile(null);
    setUploadProgress(0);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Room name required");
      return;
    }
    try {
      const price = BigInt(Number.parseInt(form.pricePerNight) || 2499);
      if (editingRoom) {
        await updateRoom.mutateAsync({
          id: editingRoom.id,
          name: form.name,
          description: form.description,
          pricePerNight: price,
          facilities: form.facilities,
          photos: editingRoom.photos,
        });
        toast.success("Room updated!");
      } else {
        const id = `room_${Date.now()}`;
        await addRoom.mutateAsync({
          id,
          name: form.name,
          description: form.description,
          pricePerNight: price,
          facilities: form.facilities,
          photos: [],
        });
        toast.success("Room added!");
      }
      resetForm();
    } catch {
      toast.error("Failed to save room");
    }
  }

  async function handlePhotoUpload(roomId: string) {
    if (!photoFile) return;
    try {
      const buffer = await photoFile.arrayBuffer();
      const uint8 = new Uint8Array(buffer);
      const blob = ExternalBlob.fromBytes(uint8).withUploadProgress((p) =>
        setUploadProgress(p),
      );
      await uploadPhoto.mutateAsync({ roomId, photo: blob });
      toast.success("Photo uploaded!");
      setPhotoFile(null);
      setUploadProgress(0);
    } catch {
      toast.error("Photo upload failed");
    }
  }

  async function handleDelete(roomId: string) {
    try {
      await deleteRoom.mutateAsync(roomId);
      toast.success("Room deleted");
    } catch {
      toast.error("Failed to delete room");
    }
  }

  const isSaving = addRoom.isPending || updateRoom.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl font-bold text-foreground">
          Manage Rooms
        </h3>
        <Button
          data-ocid="admin.add_room.primary_button"
          onClick={() => {
            setShowAddForm(true);
            setEditingRoom(null);
            setForm(DEFAULT_FORM);
          }}
          className="bg-saffron-500 hover:bg-saffron-600 text-white border-0 rounded-full font-body"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Room
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingRoom) && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-accent/30 border border-border rounded-xl p-6"
        >
          <h4 className="font-display font-bold text-lg mb-4">
            {editingRoom ? "Edit Room" : "Add New Room"}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm mb-1 block">Room Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Standard Room"
                  className="font-body"
                  required
                />
              </div>
              <div>
                <Label className="text-sm mb-1 block">
                  Price Per Night (₹)
                </Label>
                <Input
                  value={form.pricePerNight}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, pricePerNight: e.target.value }))
                  }
                  type="number"
                  placeholder="2499"
                  className="font-body"
                  required
                />
              </div>
            </div>
            <div>
              <Label className="text-sm mb-1 block">Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Describe this room..."
                className="font-body resize-none"
                rows={3}
              />
            </div>
            <div>
              <Label className="text-sm mb-2 block">Facilities</Label>
              <div className="flex flex-wrap gap-3">
                {ALL_FACILITIES.map((f) => (
                  <div key={f} className="flex items-center gap-1.5">
                    <Checkbox
                      id={`fac-${f}`}
                      checked={form.facilities.includes(f)}
                      onCheckedChange={() => toggleFacility(f)}
                    />
                    <Label
                      htmlFor={`fac-${f}`}
                      className="text-sm cursor-pointer"
                    >
                      {f}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Photo upload for existing room */}
            {editingRoom && (
              <div>
                <Label className="text-sm mb-1 block">Upload Photo</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="file"
                    accept="image/*"
                    data-ocid="admin.photo.upload_button"
                    onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                    className="font-body text-sm"
                  />
                  {photoFile && (
                    <Button
                      type="button"
                      onClick={() => handlePhotoUpload(editingRoom.id)}
                      disabled={uploadPhoto.isPending}
                      size="sm"
                      className="bg-saffron-500 text-white border-0 whitespace-nowrap"
                    >
                      {uploadPhoto.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        `Upload (${uploadProgress}%)`
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-saffron-500 hover:bg-saffron-600 text-white border-0 rounded-full font-body"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                ) : null}
                {editingRoom ? "Update Room" : "Add Room"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                className="rounded-full font-body"
              >
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Rooms list */}
      {isLoading ? (
        <div className="space-y-3">
          {["r1", "r2", "r3"].map((k) => (
            <Skeleton key={k} className="h-20 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {!rooms || rooms.length === 0 ? (
            <div
              className="text-center py-10 text-muted-foreground"
              data-ocid="admin.rooms.empty_state"
            >
              No rooms yet. Add your first room!
            </div>
          ) : (
            rooms.map((room, idx) => (
              <div
                key={room.id}
                className="flex items-center gap-4 bg-card border border-border rounded-xl p-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold text-foreground">
                    {room.name}
                  </div>
                  <div className="text-muted-foreground text-sm truncate">
                    {room.description}
                  </div>
                  <div className="text-saffron-500 font-semibold text-sm mt-0.5">
                    ₹{Number(room.pricePerNight).toLocaleString("en-IN")}/night
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    data-ocid={`admin.room.edit_button.${idx + 1}`}
                    size="sm"
                    variant="outline"
                    onClick={() => startEdit(room)}
                    className="rounded-full"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        data-ocid={`admin.room.delete_button.${idx + 1}`}
                        size="sm"
                        variant="outline"
                        className="rounded-full border-destructive text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete "{room.name}"?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the room and cannot be
                          undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel data-ocid="admin.room.delete.cancel_button">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          data-ocid="admin.room.delete.confirm_button"
                          onClick={() => handleDelete(room.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function ContactTab() {
  const { data: contactInfo, isLoading } = useGetContactInfo();
  const updateContact = useUpdateContactInfo();
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [address, setAddress] = useState("");
  const [initialized, setInitialized] = useState(false);

  if (contactInfo && !initialized) {
    setPhone(contactInfo.phone);
    setWhatsapp(contactInfo.whatsapp);
    setAddress(contactInfo.address);
    setInitialized(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      await updateContact.mutateAsync({ phone, whatsapp, address });
      toast.success("Contact info updated!");
    } catch {
      toast.error("Failed to update contact info");
    }
  }

  if (isLoading) return <Skeleton className="h-64 rounded-xl" />;

  return (
    <div>
      <h3 className="font-display text-xl font-bold text-foreground mb-6">
        Contact Information
      </h3>
      <form onSubmit={handleSave} className="space-y-4 max-w-md">
        <div>
          <Label className="text-sm mb-1 block">Phone Number</Label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="8181992992"
            className="font-body"
          />
        </div>
        <div>
          <Label className="text-sm mb-1 block">WhatsApp Number</Label>
          <Input
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="8181992992"
            className="font-body"
          />
        </div>
        <div>
          <Label className="text-sm mb-1 block">Address</Label>
          <Textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="AD Omaxe Eternity, Vrindavan"
            className="font-body resize-none"
            rows={3}
          />
        </div>
        <Button
          type="submit"
          data-ocid="admin.contact.save_button"
          disabled={updateContact.isPending}
          className="bg-saffron-500 hover:bg-saffron-600 text-white border-0 rounded-full font-body"
        >
          {updateContact.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin mr-1" />
          ) : null}
          💾 Save Changes
        </Button>
      </form>
    </div>
  );
}

function EnquiriesTab() {
  const { data: enquiries, isLoading } = useGetAllEnquiries();

  if (isLoading) return <Skeleton className="h-64 rounded-xl" />;

  return (
    <div>
      <h3 className="font-display text-xl font-bold text-foreground mb-6">
        Guest Enquiries ({enquiries?.length || 0})
      </h3>
      {!enquiries || enquiries.length === 0 ? (
        <div
          className="text-center py-10 text-muted-foreground"
          data-ocid="admin.enquiries.empty_state"
        >
          No enquiries yet.
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-accent/30">
                <TableHead className="font-display">Name</TableHead>
                <TableHead className="font-display">Phone</TableHead>
                <TableHead className="font-display">Message</TableHead>
                <TableHead className="font-display">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enquiries.map((eq) => (
                <TableRow key={`${eq.phone}-${eq.timestamp}`}>
                  <TableCell className="font-body font-medium">
                    {eq.name}
                  </TableCell>
                  <TableCell className="font-body">
                    <a
                      href={`tel:${eq.phone}`}
                      className="text-saffron-500 hover:underline"
                    >
                      {eq.phone}
                    </a>
                  </TableCell>
                  <TableCell className="font-body text-sm text-muted-foreground max-w-xs">
                    <span className="line-clamp-2">{eq.message}</span>
                  </TableCell>
                  <TableCell className="font-body text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(
                      Number(eq.timestamp) / 1_000_000,
                    ).toLocaleDateString("en-IN")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const { data: isAdmin, isLoading: isCheckingAdmin } = useIsAdmin();
  const { login, loginStatus, isInitializing } = useInternetIdentity();

  if (isInitializing || isCheckingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-saffron-500 mx-auto mb-3" />
          <p className="font-body text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-accent/20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-8 shadow-md text-center max-w-sm w-full"
        >
          <div className="text-5xl mb-4">🔐</div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Admin Panel
          </h2>
          <p className="text-muted-foreground font-body text-sm mb-6">
            Please login with your Internet Identity to access the admin
            dashboard.
          </p>
          <Button
            data-ocid="admin.login.button"
            onClick={() => login()}
            disabled={loginStatus === "logging-in"}
            className="w-full bg-saffron-500 hover:bg-saffron-600 text-white border-0 rounded-full font-body font-semibold"
          >
            {loginStatus === "logging-in" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Logging in...
              </>
            ) : (
              "🔑 Login with Internet Identity"
            )}
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-accent/10">
      <div className="saffron-gradient text-white py-10 px-4 text-center">
        <div className="text-3xl mb-1">⚙️</div>
        <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-white/75 font-body text-sm mt-1">
          Teerth Vaas — Manage your guest house
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <Tabs defaultValue="rooms">
          <TabsList className="mb-6 bg-card border border-border">
            <TabsTrigger
              data-ocid="admin.rooms.tab"
              value="rooms"
              className="font-body"
            >
              🛏️ Rooms
            </TabsTrigger>
            <TabsTrigger
              data-ocid="admin.contact.tab"
              value="contact"
              className="font-body"
            >
              📞 Contact Info
            </TabsTrigger>
            <TabsTrigger
              data-ocid="admin.enquiries.tab"
              value="enquiries"
              className="font-body"
            >
              📋 Enquiries
            </TabsTrigger>
          </TabsList>
          <TabsContent value="rooms">
            <div className="bg-card border border-border rounded-2xl p-6">
              <RoomsTab />
            </div>
          </TabsContent>
          <TabsContent value="contact">
            <div className="bg-card border border-border rounded-2xl p-6">
              <ContactTab />
            </div>
          </TabsContent>
          <TabsContent value="enquiries">
            <div className="bg-card border border-border rounded-2xl p-6">
              <EnquiriesTab />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
