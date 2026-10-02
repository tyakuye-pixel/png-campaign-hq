import OQL "mo:caffeineai-oql";
import Types "types/electorates";

module {
  public func _toRow(self : Types.SeatType) : OQL.Value =
    switch self {
      case (#open) { #text("open") };
      case (#regional) { #text("regional") };
    };
};
