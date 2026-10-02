import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Types "../types/electorates";
import Common "../types/common";

module {
  public type State = {
    electorates : Map.Map<Common.ElectorateId, Types.Electorate>;
    activities : List.List<Types.CampaignActivity>;
    var nextActivityId : Nat;
  };

  public func listElectorates(state : State) : [Types.Electorate] {
    state.electorates.values().toArray();
  };

  public func getElectorate(state : State, id : Common.ElectorateId) : ?Types.Electorate {
    state.electorates.get(id);
  };

  public func listActivities(state : State, electorateId : Common.ElectorateId) : [Types.CampaignActivity] {
    state.activities.toArray().filter(func(a) = a.electorateId == electorateId);
  };

  public func getNationalSummary(state : State) : Types.NationalSummary {
    let electorates = state.electorates.values().toArray();

    var totalRegisteredVoters = 0;
    for (e in electorates.values()) {
      totalRegisteredVoters += e.registeredVoters;
    };

    let provinceCounts = Map.empty<Text, Nat>();
    for (e in electorates.values()) {
      let current = provinceCounts.get(e.province) ?? 0;
      provinceCounts.add(e.province, current + 1);
    };

    let levels : [Types.SupportLevel] = [#Strong, #Leaning, #Undecided, #Weak, #Opposed];
    let countsBySupportLevel = levels.map(func(level) {
      var count = 0;
      for (e in electorates.values()) {
        if (e.supportLevel == level) { count += 1 };
      };
      { supportLevel = level; count };
    });

    {
      totalElectorates = electorates.size();
      totalProvinces = provinceCounts.size();
      totalRegisteredVoters;
      totalActivities = state.activities.size();
      countsByProvince = provinceCounts.entries().map(func((province, count)) = { province; count }).toArray();
      countsBySupportLevel;
    };
  };

  public func listRecentActivities(state : State, limit : Nat) : [Types.CampaignActivity] {
    let sorted = state.activities.toArray().sort(func(a, b) = Int.compare(b.createdAt, a.createdAt));
    if (limit >= sorted.size()) { sorted } else { sorted.sliceToArray(0, limit.toInt()) };
  };

  public func updateCampaignDetails(
    state : State,
    id : Common.ElectorateId,
    details : Types.UpdateCampaignDetails,
  ) : ?Types.Electorate {
    switch (state.electorates.get(id)) {
      case null { null };
      case (?existing) {
        let updated : Types.Electorate = {
          id = existing.id;
          name = existing.name;
          province = existing.province;
          region = existing.region;
          seatType = existing.seatType;
          registeredVoters = existing.registeredVoters;
          supportLevel = details.supportLevel;
          campaignManager = details.campaignManager;
          notes = details.notes;
          updatedAt = Time.now();
        };
        state.electorates.add(id, updated);
        ?updated;
      };
    };
  };

  public func addActivity(
    state : State,
    electorateId : Common.ElectorateId,
    input : Types.NewActivity,
  ) : ?Types.CampaignActivity {
    if (state.electorates.get(electorateId) == null) {
      return null;
    };
    let activity : Types.CampaignActivity = {
      id = state.nextActivityId;
      electorateId;
      activityType = input.activityType;
      date = input.date;
      description = input.description;
      createdAt = Time.now();
    };
    state.nextActivityId += 1;
    state.activities.add(activity);
    ?activity;
  };
};
