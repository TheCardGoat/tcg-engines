import type { CharacterCard } from "@tcg/lorcana-types";
import { shereKhanKeeneyedHunterI18n } from "./108-shere-khan-keen-eyed-hunter.i18n";

export const shereKhanKeeneyedHunter: CharacterCard = {
  id: "601",
  canonicalId: "ci_601",
  reprints: ["set10-108"],
  cardType: "character",
  name: "Shere Khan",
  version: "Keen-Eyed Hunter",
  inkType: ["ruby"],
  franchise: "Jungle Book",
  set: "010",
  cardNumber: 108,
  rarity: "common",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_92a9208587e145dc808634c7d82007ef",
    tcgPlayer: 659599,
  },
  classifications: ["Storyborn", "Villain"],
  i18n: shereKhanKeeneyedHunterI18n,
};
