import Common "../types/common";

module {
  public type SeatType = { #open; #regional };

  public type SupportLevel = {
    #Strong;
    #Leaning;
    #Undecided;
    #Weak;
    #Opposed;
  };

  public type ActivityType = { #event; #contact; #note };

  public type Electorate = {
    id : Common.ElectorateId;
    name : Text;
    province : Text;
    region : Text;
    seatType : SeatType;
    registeredVoters : Nat;
    supportLevel : SupportLevel;
    campaignManager : Text;
    notes : Text;
    updatedAt : Common.Timestamp;
  };

  public type CampaignActivity = {
    id : Common.ActivityId;
    electorateId : Common.ElectorateId;
    activityType : ActivityType;
    date : Common.Timestamp;
    description : Text;
    createdAt : Common.Timestamp;
  };

  public type ProvinceCount = {
    province : Text;
    count : Nat;
  };

  public type SupportLevelCount = {
    supportLevel : SupportLevel;
    count : Nat;
  };

  public type NationalSummary = {
    totalElectorates : Nat;
    totalProvinces : Nat;
    totalRegisteredVoters : Nat;
    totalActivities : Nat;
    countsByProvince : [ProvinceCount];
    countsBySupportLevel : [SupportLevelCount];
  };

  public type UpdateCampaignDetails = {
    supportLevel : SupportLevel;
    campaignManager : Text;
    notes : Text;
  };

  public type NewActivity = {
    activityType : ActivityType;
    date : Common.Timestamp;
    description : Text;
  };
};
