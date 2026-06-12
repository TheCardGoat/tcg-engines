import type { CharacterCard } from "@tcg/lorcana-types";
import { friendOwlCantankerousNeighborI18n } from "./144-friend-owl-cantankerous-neighbor.i18n";

export const friendOwlCantankerousNeighbor: CharacterCard = {
  id: "CQX",
  canonicalId: "ci_CQX",
  reprints: ["set8-144"],
  cardType: "character",
  name: "Friend Owl",
  version: "Cantankerous Neighbor",
  inkType: ["ruby"],
  franchise: "Bambi",
  set: "008",
  cardNumber: 144,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_fee05898e5484f948ef002681b38ec43",
    tcgPlayer: 631444,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: friendOwlCantankerousNeighborI18n,
};
