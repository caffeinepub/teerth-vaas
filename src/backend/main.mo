import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

actor {
  type Room = {
    id : Text;
    name : Text;
    description : Text;
    pricePerNight : Nat;
    facilities : [Text];
    photos : [Storage.ExternalBlob];
  };

  module Room {
    public func compare(room1 : Room, room2 : Room) : Order.Order {
      Text.compare(room1.id, room2.id);
    };
  };

  type ContactInfo = {
    phone : Text;
    whatsapp : Text;
    address : Text;
  };

  type Enquiry = {
    name : Text;
    phone : Text;
    message : Text;
    timestamp : Time.Time;
  };

  public type UserProfile = {
    name : Text;
  };

  let rooms = Map.empty<Text, Room>();
  let enquiries = List.empty<Enquiry>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let defaultContactInfo : ContactInfo = {
    phone = "9873549090";
    whatsapp = "9873549090";
    address = "Opposite Prem Mandir, Near Banke Bihari Ji Road, Vrindavan, Mathura, Uttar Pradesh, India";
  };

  var contactInfo : ContactInfo = defaultContactInfo;

  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func submitEnquiry(name : Text, phone : Text, message : Text) : async () {
    let enquiry : Enquiry = {
      name;
      phone;
      message;
      timestamp = Time.now();
    };
    enquiries.add(enquiry);
  };

  public query ({ caller }) func getAllEnquiries() : async [Enquiry] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view enquiries");
    };
    enquiries.toArray();
  };

  public shared ({ caller }) func addRoom(id : Text, name : Text, description : Text, pricePerNight : Nat, facilities : [Text], photos : [Storage.ExternalBlob]) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add rooms");
    };
    let room : Room = {
      id;
      name;
      description;
      pricePerNight;
      facilities;
      photos;
    };
    rooms.add(id, room);
  };

  public shared ({ caller }) func updateRoom(id : Text, name : Text, description : Text, pricePerNight : Nat, facilities : [Text], photos : [Storage.ExternalBlob]) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update rooms");
    };
    switch (rooms.get(id)) {
      case (null) { Runtime.trap("Room not found") };
      case (_) {
        let room : Room = {
          id;
          name;
          description;
          pricePerNight;
          facilities;
          photos;
        };
        rooms.add(id, room);
      };
    };
  };

  public shared ({ caller }) func deleteRoom(roomId : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete rooms");
    };
    if (not rooms.containsKey(roomId)) {
      Runtime.trap("Room not found");
    };
    rooms.remove(roomId);
  };

  public query ({ caller }) func getAllRooms() : async [Room] {
    rooms.values().toArray().sort();
  };

  public shared ({ caller }) func updateContactInfo(phone : Text, whatsapp : Text, address : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update contact info");
    };
    contactInfo := {
      phone;
      whatsapp;
      address;
    };
  };

  public query ({ caller }) func getContactInfo() : async ContactInfo {
    contactInfo;
  };

  public shared ({ caller }) func uploadRoomPhoto(roomId : Text, photo : Storage.ExternalBlob) : async [Storage.ExternalBlob] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can upload photos");
    };
    switch (rooms.get(roomId)) {
      case (null) { Runtime.trap("Room not found") };
      case (?room) {
        let newPhotos = room.photos.concat([photo]);
        let updatedRoom : Room = {
          id = room.id;
          name = room.name;
          description = room.description;
          pricePerNight = room.pricePerNight;
          facilities = room.facilities;
          photos = newPhotos;
        };
        rooms.add(roomId, updatedRoom);
        newPhotos;
      };
    };
  };

  public shared ({ caller }) func initialize() : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can initialize");
    };
    let standardRoom : Room = {
      id = "standardRoom";
      name = "Standard Room";
      description = "Our Standard Room offers a comfortable and cozy stay, perfect for solo travelers or couples. Enjoy modern amenities in a serene environment, ideal for relaxation and rejuvenation.";
      pricePerNight = 2499;
      facilities = ["AC", "WiFi", "Private Bathroom", "Hot Water"];
      photos = [];
    };

    let coupleRoom : Room = {
      id = "coupleRoom";
      name = "Couple Room";
      description = "Experience intimate comfort in our Couple Room. Designed for relaxation and privacy, this room features modern amenities in a romantic setting, perfect for couples seeking a memorable stay.";
      pricePerNight = 2499;
      facilities = ["AC", "WiFi", "Private Bathroom", "Hot Water"];
      photos = [];
    };

    let familyRoom : Room = {
      id = "familyRoom";
      name = "Family Room";
      description = "Spacious and well-appointed, our Family Room is ideal for families and groups. Enjoy comfort, convenience, and plenty of space, making your stay enjoyable for all ages.";
      pricePerNight = 2499;
      facilities = ["AC", "WiFi", "Private Bathroom", "Hot Water"];
      photos = [];
    };

    rooms.add(standardRoom.id, standardRoom);
    rooms.add(coupleRoom.id, coupleRoom);
    rooms.add(familyRoom.id, familyRoom);
  };
};
