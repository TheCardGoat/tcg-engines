import type { CharacterCard } from "@tcg/lorcana-types";
import { benjaBoldUniterI18n } from "./104-benja-bold-uniter.i18n";

export const benjaBoldUniter: CharacterCard = {
  id: "q79",
  canonicalId: "ci_q79",
  reprints: ["set4-104"],
  cardType: "character",
  name: "Benja",
  version: "Bold Uniter",
  inkType: ["ruby"],
  franchise: "Raya and the Last Dragon",
  set: "004",
  cardNumber: 104,
  rarity: "common",
  cost: 4,
  strength: 5,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_35af1bfc231746a3914e8e02bb3b8afa",
    tcgPlayer: 550589,
  },
  classifications: ["Storyborn", "Mentor", "King"],
  i18n: benjaBoldUniterI18n,
};
