import type { CharacterCard } from "@tcg/lorcana-types";
import { pachaVillageLeaderI18n } from "./190-pacha-village-leader.i18n";

export const pachaVillageLeader: CharacterCard = {
  id: "SED",
  canonicalId: "ci_SED",
  reprints: ["set2-190"],
  cardType: "character",
  name: "Pacha",
  version: "Village Leader",
  inkType: ["steel"],
  franchise: "Emperors New Groove",
  set: "002",
  cardNumber: 190,
  rarity: "uncommon",
  cost: 6,
  strength: 4,
  willpower: 8,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_4baaef6e190c46e4b03966728f10034a",
    tcgPlayer: 527778,
  },
  classifications: ["Storyborn", "Hero"],
  i18n: pachaVillageLeaderI18n,
};
