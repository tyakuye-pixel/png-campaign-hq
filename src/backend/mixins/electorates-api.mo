import AccessControl "mo:caffeineai-authorization/access-control";
import Runtime "mo:core/Runtime";
import Types "../types/electorates";
import Common "../types/common";
import ElectoratesLib "../lib/electorates";

mixin (
  state : ElectoratesLib.State,
  accessControlState : AccessControl.AccessControlState,
) {
  public query func listElectorates() : async [Types.Electorate] {
    ElectoratesLib.listElectorates(state);
  };

  public query func getElectorate(id : Common.ElectorateId) : async ?Types.Electorate {
    ElectoratesLib.getElectorate(state, id);
  };

  public query func listActivities(electorateId : Common.ElectorateId) : async [Types.CampaignActivity] {
    ElectoratesLib.listActivities(state, electorateId);
  };

  public query func getNationalSummary() : async Types.NationalSummary {
    ElectoratesLib.getNationalSummary(state);
  };

  public query func listRecentActivities(limit : Nat) : async [Types.CampaignActivity] {
    ElectoratesLib.listRecentActivities(state, limit);
  };

  public shared ({ caller }) func updateCampaignDetails(
    id : Common.ElectorateId,
    details : Types.UpdateCampaignDetails,
  ) : async ?Types.Electorate {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update campaign details");
    };
    ElectoratesLib.updateCampaignDetails(state, id, details);
  };

  public shared ({ caller }) func addActivity(
    electorateId : Common.ElectorateId,
    input : Types.NewActivity,
  ) : async ?Types.CampaignActivity {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add activities");
    };
    ElectoratesLib.addActivity(state, electorateId, input);
  };
};
