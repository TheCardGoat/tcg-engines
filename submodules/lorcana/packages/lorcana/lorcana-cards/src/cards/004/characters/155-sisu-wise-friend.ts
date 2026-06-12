import type { CharacterCard } from "@tcg/lorcana-types";
import { sisuWiseFriendI18n } from "./155-sisu-wise-friend.i18n";

export const sisuWiseFriend: CharacterCard = {
  id: "Pec",
  canonicalId: "ci_Pec",
  reprints: ["set4-155"],
  cardType: "character",
  name: "Sisu",
  version: "Wise Friend",
  inkType: ["sapphire"],
  franchise: "Raya and the Last Dragon",
  set: "004",
  cardNumber: 155,
  rarity: "uncommon",
  cost: 6,
  strength: 6,
  willpower: 6,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_bcef0c1c280242a8878b505860c6d89b",
    tcgPlayer: 550527,
  },
  classifications: ["Storyborn", "Hero", "Deity", "Dragon"],
  i18n: sisuWiseFriendI18n,
};
