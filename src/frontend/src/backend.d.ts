import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export interface Room {
    id: string;
    pricePerNight: bigint;
    name: string;
    description: string;
    facilities: Array<string>;
    photos: Array<ExternalBlob>;
}
export interface Enquiry {
    name: string;
    message: string;
    timestamp: Time;
    phone: string;
}
export interface ContactInfo {
    whatsapp: string;
    address: string;
    phone: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addRoom(id: string, name: string, description: string, pricePerNight: bigint, facilities: Array<string>, photos: Array<ExternalBlob>): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteRoom(roomId: string): Promise<void>;
    getAllEnquiries(): Promise<Array<Enquiry>>;
    getAllRooms(): Promise<Array<Room>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactInfo(): Promise<ContactInfo>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initialize(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitEnquiry(name: string, phone: string, message: string): Promise<void>;
    updateContactInfo(phone: string, whatsapp: string, address: string): Promise<void>;
    updateRoom(id: string, name: string, description: string, pricePerNight: bigint, facilities: Array<string>, photos: Array<ExternalBlob>): Promise<void>;
    uploadRoomPhoto(roomId: string, photo: ExternalBlob): Promise<Array<ExternalBlob>>;
}
