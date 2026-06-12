import type { CharacterCard } from "@tcg/lorcana-types";
import { hueySavvyNephew as canonicalHueySavvyNephew } from "../../003";

export const hueySavvyNephew: CharacterCard = {
  ...canonicalHueySavvyNephew,
  id: "34Z",
  reprints: ["set3-145", "set9-138"],
  set: "009",
  cardNumber: 138,
  rarity: "rare",
  externalIds: {
    lorcast: "crd_5008e2e0ceb04bb9878d2590c92b32ee",
    tcgPlayer: 650073,
  },
};
