import OQL "mo:caffeineai-oql";
import Types "types/electorates";

module {
  public func _toRow(self : Types.SupportLevel) : OQL.Value =
    switch self {
      case (#Strong) { #text("Strong") };
      case (#Leaning) { #text("Leaning") };
      case (#Undecided) { #text("Undecided") };
      case (#Weak) { #text("Weak") };
      case (#Opposed) { #text("Opposed") };
    };
};
