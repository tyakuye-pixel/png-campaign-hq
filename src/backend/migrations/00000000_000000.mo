import AccessControl "mo:caffeineai-authorization/access-control";
import Map "mo:core/Map";
import List "mo:core/List";

module {
  type SeatType = { #open; #regional };
  type SupportLevel = { #Strong; #Leaning; #Undecided; #Weak; #Opposed };
  type ActivityType = { #event; #contact; #note };

  type Electorate = {
    id : Nat;
    name : Text;
    province : Text;
    region : Text;
    seatType : SeatType;
    registeredVoters : Nat;
    supportLevel : SupportLevel;
    campaignManager : Text;
    notes : Text;
    updatedAt : Int;
  };

  type CampaignActivity = {
    id : Nat;
    electorateId : Nat;
    activityType : ActivityType;
    date : Int;
    description : Text;
    createdAt : Int;
  };

  type State = {
    electorates : Map.Map<Nat, Electorate>;
    activities : List.List<CampaignActivity>;
    var nextActivityId : Nat;
  };

  type OldActor = {};
  type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    state : State;
  };

  // (id, name, province, region, seatType, registeredVoters)
  let seed : [(Nat, Text, Text, Text, SeatType, Nat)] = [
    // National Capital District
    (1, "Moresby North-East", "National Capital District", "Southern", #open, 62000),
    (2, "Moresby North-West", "National Capital District", "Southern", #open, 58000),
    (3, "Moresby South", "National Capital District", "Southern", #open, 54000),
    (4, "NCD Regional", "National Capital District", "Southern", #regional, 174000),
    // Central
    (5, "Abau", "Central", "Southern", #open, 32000),
    (6, "Goilala", "Central", "Southern", #open, 28000),
    (7, "Kairuku", "Central", "Southern", #open, 35000),
    (8, "Rigo", "Central", "Southern", #open, 30000),
    (9, "Central Regional", "Central", "Southern", #regional, 125000),
    // Gulf
    (10, "Kerema", "Gulf", "Southern", #open, 34000),
    (11, "Kikori", "Gulf", "Southern", #open, 26000),
    (12, "Gulf Regional", "Gulf", "Southern", #regional, 60000),
    // Milne Bay
    (13, "Alotau", "Milne Bay", "Southern", #open, 38000),
    (14, "Esa'ala", "Milne Bay", "Southern", #open, 29000),
    (15, "Kiriwina-Goodenough", "Milne Bay", "Southern", #open, 33000),
    (16, "Samarai-Murua", "Milne Bay", "Southern", #open, 27000),
    (17, "Milne Bay Regional", "Milne Bay", "Southern", #regional, 127000),
    // Oro (Northern)
    (18, "Ijivitari", "Oro", "Southern", #open, 31000),
    (19, "Sohe", "Oro", "Southern", #open, 30000),
    (20, "Oro Regional", "Oro", "Southern", #regional, 61000),
    // Western
    (21, "Middle Fly", "Western", "Southern", #open, 25000),
    (22, "North Fly", "Western", "Southern", #open, 28000),
    (23, "South Fly", "Western", "Southern", #open, 24000),
    (24, "Western Regional", "Western", "Southern", #regional, 77000),
    // Southern Highlands
    (25, "Imbonggu", "Southern Highlands", "Highlands", #open, 42000),
    (26, "Ialibu-Pangia", "Southern Highlands", "Highlands", #open, 40000),
    (27, "Kagua-Erave", "Southern Highlands", "Highlands", #open, 38000),
    (28, "Mendi", "Southern Highlands", "Highlands", #open, 45000),
    (29, "Nipa-Kutubu", "Southern Highlands", "Highlands", #open, 43000),
    (30, "Southern Highlands Regional", "Southern Highlands", "Highlands", #regional, 208000),
    // Hela
    (31, "Koroba-Kopiago", "Hela", "Highlands", #open, 36000),
    (32, "Tari-Pori", "Hela", "Highlands", #open, 39000),
    (33, "Komo-Magarima", "Hela", "Highlands", #open, 37000),
    (34, "Hela Regional", "Hela", "Highlands", #regional, 112000),
    // Enga
    (35, "Kandep", "Enga", "Highlands", #open, 41000),
    (36, "Kompiram", "Enga", "Highlands", #open, 39000),
    (37, "Laiagam-Porgera", "Enga", "Highlands", #open, 37000),
    (38, "Wabag", "Enga", "Highlands", #open, 40000),
    (39, "Wapenamanda", "Enga", "Highlands", #open, 38000),
    (40, "Enga Regional", "Enga", "Highlands", #regional, 195000),
    // Western Highlands
    (41, "Anglimp-South Waghi", "Western Highlands", "Highlands", #open, 44000),
    (42, "Dei", "Western Highlands", "Highlands", #open, 40000),
    (43, "Hagen", "Western Highlands", "Highlands", #open, 46000),
    (44, "Jimi", "Western Highlands", "Highlands", #open, 38000),
    (45, "Mul-Baiyer", "Western Highlands", "Highlands", #open, 42000),
    (46, "Tambul-Nebilyer", "Western Highlands", "Highlands", #open, 41000),
    (47, "Western Highlands Regional", "Western Highlands", "Highlands", #regional, 251000),
    // Jiwaka
    (48, "Anglimp-South Waghi", "Jiwaka", "Highlands", #open, 43000),
    (49, "Jimi", "Jiwaka", "Highlands", #open, 39000),
    (50, "North Waghi", "Jiwaka", "Highlands", #open, 40000),
    (51, "Jiwaka Regional", "Jiwaka", "Highlands", #regional, 122000),
    // Chimbu (Simbu)
    (52, "Chuave", "Chimbu", "Highlands", #open, 37000),
    (53, "Gumine", "Chimbu", "Highlands", #open, 36000),
    (54, "Karimui-Nomane", "Chimbu", "Highlands", #open, 34000),
    (55, "Kerowagi", "Chimbu", "Highlands", #open, 38000),
    (56, "Kundiawa-Gembogl", "Chimbu", "Highlands", #open, 39000),
    (57, "Sinasina-Yonggomugl", "Chimbu", "Highlands", #open, 35000),
    (58, "Chimbu Regional", "Chimbu", "Highlands", #regional, 219000),
    // Eastern Highlands
    (59, "Daulo", "Eastern Highlands", "Highlands", #open, 40000),
    (60, "Goroka", "Eastern Highlands", "Highlands", #open, 43000),
    (61, "Kainantu", "Eastern Highlands", "Highlands", #open, 42000),
    (62, "Lufa", "Eastern Highlands", "Highlands", #open, 38000),
    (63, "Obura-Wonenara", "Eastern Highlands", "Highlands", #open, 36000),
    (64, "Unggai-Bena", "Eastern Highlands", "Highlands", #open, 39000),
    (65, "Eastern Highlands Regional", "Eastern Highlands", "Highlands", #regional, 238000),
    // Morobe
    (66, "Bulolo", "Morobe", "Momase", #open, 45000),
    (67, "Finschhafen", "Morobe", "Momase", #open, 40000),
    (68, "Huon Gulf", "Morobe", "Momase", #open, 42000),
    (69, "Kabwum", "Morobe", "Momase", #open, 37000),
    (70, "Lae", "Morobe", "Momase", #open, 48000),
    (71, "Markham", "Morobe", "Momase", #open, 41000),
    (72, "Menyamya", "Morobe", "Momase", #open, 38000),
    (73, "Nawaeb", "Morobe", "Momase", #open, 39000),
    (74, "Tewae-Siassi", "Morobe", "Momase", #open, 36000),
    (75, "Morobe Regional", "Morobe", "Momase", #regional, 366000),
    // Madang
    (76, "Bogia", "Madang", "Momase", #open, 38000),
    (77, "Madang", "Madang", "Momase", #open, 42000),
    (78, "Middle Ramu", "Madang", "Momase", #open, 36000),
    (79, "Sumkar", "Madang", "Momase", #open, 39000),
    (80, "Usino-Bundi", "Madang", "Momase", #open, 37000),
    (81, "Madang Regional", "Madang", "Momase", #regional, 192000),
    // East Sepik
    (82, "Ambunti-Dreikikir", "East Sepik", "Momase", #open, 40000),
    (83, "Angoram", "East Sepik", "Momase", #open, 38000),
    (84, "Maprik", "East Sepik", "Momase", #open, 41000),
    (85, "Wewak", "East Sepik", "Momase", #open, 43000),
    (86, "Wosera-Gawi", "East Sepik", "Momase", #open, 39000),
    (87, "Yangoru-Saussia", "East Sepik", "Momase", #open, 40000),
    (88, "East Sepik Regional", "East Sepik", "Momase", #regional, 241000),
    // West Sepik (Sandaun)
    (89, "Aitape-Lumi", "West Sepik", "Momase", #open, 37000),
    (90, "Nuku", "West Sepik", "Momase", #open, 35000),
    (91, "Telefomin", "West Sepik", "Momase", #open, 33000),
    (92, "Vanimo-Green River", "West Sepik", "Momase", #open, 36000),
    (93, "West Sepik Regional", "West Sepik", "Momase", #regional, 141000),
    // Manus
    (94, "Manus", "Manus", "Islands", #open, 32000),
    (95, "Manus Regional", "Manus", "Islands", #regional, 32000),
    // New Ireland
    (96, "Kavieng", "New Ireland", "Islands", #open, 38000),
    (97, "Namatanai", "New Ireland", "Islands", #open, 36000),
    (98, "New Ireland Regional", "New Ireland", "Islands", #regional, 74000),
    // East New Britain
    (99, "Gazelle", "East New Britain", "Islands", #open, 42000),
    (100, "Kokopo", "East New Britain", "Islands", #open, 44000),
    (101, "Pomio", "East New Britain", "Islands", #open, 37000),
    (102, "Rabaul", "East New Britain", "Islands", #open, 40000),
    (103, "East New Britain Regional", "East New Britain", "Islands", #regional, 163000),
    // West New Britain
    (104, "Kandrian-Gloucester", "West New Britain", "Islands", #open, 38000),
    (105, "Talasea", "West New Britain", "Islands", #open, 41000),
    (106, "West New Britain Regional", "West New Britain", "Islands", #regional, 79000),
    // Bougainville (Autonomous Region)
    (107, "Central Bougainville", "Bougainville", "Islands", #open, 39000),
    (108, "North Bougainville", "Bougainville", "Islands", #open, 37000),
    (109, "South Bougainville", "Bougainville", "Islands", #open, 36000),
    (110, "Bougainville Regional", "Bougainville", "Islands", #regional, 112000),
  ];

  public func migration(_ : OldActor) : NewActor {
    let electorates = Map.empty<Nat, Electorate>();
    for ((id, name, province, region, seatType, registeredVoters) in seed.values()) {
      electorates.add(id, {
        id;
        name;
        province;
        region;
        seatType;
        registeredVoters;
        supportLevel = #Undecided;
        campaignManager = "";
        notes = "";
        updatedAt = 0;
      });
    };
    {
      accessControlState = AccessControl.initState();
      state = {
        electorates;
        activities = List.empty();
        var nextActivityId = 0;
      };
    };
  };
};
