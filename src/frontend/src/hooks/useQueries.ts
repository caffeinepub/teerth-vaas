import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ContactInfo, Enquiry, ExternalBlob, Room } from "../backend";
import { useActor } from "./useActor";

export function useGetAllRooms() {
  const { actor, isFetching } = useActor();
  return useQuery<Room[]>({
    queryKey: ["rooms"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRooms();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30000,
  });
}

export function useGetContactInfo() {
  const { actor, isFetching } = useActor();
  return useQuery<ContactInfo>({
    queryKey: ["contactInfo"],
    queryFn: async () => {
      if (!actor)
        return {
          phone: "8181992992",
          whatsapp: "8181992992",
          address: "AD Omaxe Eternity, Vrindavan",
        };
      return actor.getContactInfo();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60000,
  });
}

export function useGetAllEnquiries() {
  const { actor, isFetching } = useActor();
  return useQuery<Enquiry[]>({
    queryKey: ["enquiries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEnquiries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitEnquiry() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      name,
      phone,
      message,
    }: { name: string; phone: string; message: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitEnquiry(name, phone, message);
    },
  });
}

export function useAddRoom() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (room: {
      id: string;
      name: string;
      description: string;
      pricePerNight: bigint;
      facilities: string[];
      photos: ExternalBlob[];
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addRoom(
        room.id,
        room.name,
        room.description,
        room.pricePerNight,
        room.facilities,
        room.photos,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rooms"] }),
  });
}

export function useUpdateRoom() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (room: {
      id: string;
      name: string;
      description: string;
      pricePerNight: bigint;
      facilities: string[];
      photos: ExternalBlob[];
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateRoom(
        room.id,
        room.name,
        room.description,
        room.pricePerNight,
        room.facilities,
        room.photos,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rooms"] }),
  });
}

export function useDeleteRoom() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (roomId: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteRoom(roomId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rooms"] }),
  });
}

export function useUpdateContactInfo() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      phone,
      whatsapp,
      address,
    }: { phone: string; whatsapp: string; address: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateContactInfo(phone, whatsapp, address);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contactInfo"] }),
  });
}

export function useUploadRoomPhoto() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      roomId,
      photo,
    }: { roomId: string; photo: ExternalBlob }) => {
      if (!actor) throw new Error("Not connected");
      return actor.uploadRoomPhoto(roomId, photo);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rooms"] }),
  });
}
