import type { CharacterCard } from "@tcg/lorcana-types";
import { queenOfHeartsSensingWeakness as canonicalQueenOfHeartsSensingWeakness } from "../../002";

export const queenOfHeartsSensingWeakness: CharacterCard = {
  ...canonicalQueenOfHeartsSensingWeakness,
  id: "PV9",
  reprints: ["set2-120", "set9-120"],
  set: "009",
  cardNumber: 120,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_51f0f91029254f61ab6d7b91efb0873b",
    tcgPlayer: 647670,
  },
};
