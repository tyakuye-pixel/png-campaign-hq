import OQL "mo:caffeineai-oql";
import Types "types/electorates";

module {
  public func _toRow(self : Types.ActivityType) : OQL.Value =
    switch self {
      case (#event) { #text("event") };
      case (#contact) { #text("contact") };
      case (#note) { #text("note") };
    };
};
