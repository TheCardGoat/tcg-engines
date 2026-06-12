import type { CharacterCard } from "@tcg/lorcana-types";
import { nalaFierceFriendI18n } from "./186-nala-fierce-friend.i18n";

export const nalaFierceFriend: CharacterCard = {
  id: "LbB",
  canonicalId: "ci_LbB",
  reprints: ["set3-186"],
  cardType: "character",
  name: "Nala",
  version: "Fierce Friend",
  inkType: ["steel"],
  franchise: "Lion King",
  set: "003",
  cardNumber: 186,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_03d8f4376dce4de989d8ba11a0d65ceb",
    tcgPlayer: 538013,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: nalaFierceFriendI18n,
};
