import type { CharacterCard } from "@tcg/lorcana-types";
import { pegasusSearchingHighAndLowI18n } from "./106-pegasus-searching-high-and-low.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const pegasusSearchingHighAndLow: CharacterCard = {
  id: "t4R",
  canonicalId: "ci_t4R",
  reprints: ["set12-106"],
  cardType: "character",
  name: "Pegasus",
  version: "Searching High and Low",
  inkType: ["ruby"],
  franchise: "Hercules",
  set: "012",
  cardNumber: 106,
  rarity: "common",
  cost: 6,
  strength: 6,
  willpower: 7,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_0a746213099d4c5eaf9ea5bf5926a411",
  },
  text: "Evasive",
  classifications: ["Dreamborn", "Ally"],
  abilities: [evasive],
  i18n: pegasusSearchingHighAndLowI18n,
};
