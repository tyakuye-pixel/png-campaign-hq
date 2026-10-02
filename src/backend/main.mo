import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import Expose "mo:caffeineai-oql/Expose";
import MapEntity "mo:caffeineai-oql/MapEntity";
import ListEntity "mo:caffeineai-oql/ListEntity";
import Entity "mo:caffeineai-oql/Entity";
import RecordValue "mo:caffeineai-oql/RecordValue";
import NatValue "mo:caffeineai-oql/NatValue";
import IntValue "mo:caffeineai-oql/IntValue";
import TextValue "mo:caffeineai-oql/TextValue";
import SeatTypeValue "SeatTypeValue";
import SupportLevelValue "SupportLevelValue";
import ActivityTypeValue "ActivityTypeValue";
import ElectoratesApi "mixins/electorates-api";
import ApiDocMixin "mixins/api-doc";
import ElectoratesLib "lib/electorates";

actor {
  let accessControlState : AccessControl.AccessControlState;
  let state : ElectoratesLib.State;

  include MixinAuthorization(accessControlState, null);
  include ElectoratesApi(state, accessControlState);
  include ApiDocMixin();
  include Expose({
    entities = [
      state.electorates.toEntity("electorate", "Electorate", "id")
        .sample({
          id = 0;
          name = "";
          province = "";
          region = "";
          seatType = #open;
          registeredVoters = 0;
          supportLevel = #Undecided;
          campaignManager = "";
          notes = "";
          updatedAt = 0;
        })
        .public_()
        .build(),
      state.activities.toEntity("activity", "CampaignActivity", "id")
        .sample({
          id = 0;
          electorateId = 0;
          activityType = #event;
          date = 0;
          description = "";
          createdAt = 0;
        })
        .public_()
        .build(),
    ];
  });
};
