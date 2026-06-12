import type { CharacterCard } from "@tcg/lorcana-types";
import { mulanFreeSpiritI18n } from "./015-mulan-free-spirit.i18n";

export const mulanFreeSpirit: CharacterCard = {
  id: "8GL",
  canonicalId: "ci_Dqt",
  reprints: ["set2-015", "set9-010"],
  cardType: "character",
  name: "Mulan",
  version: "Free Spirit",
  inkType: ["amber"],
  franchise: "Mulan",
  set: "002",
  cardNumber: 15,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_a931864a0b0e42c7852e9609ea84914f",
    tcgPlayer: 649959,
  },
  text: "Support",
  classifications: ["Dreamborn", "Hero", "Princess"],
  abilities: [
    {
      id: "roa-1",
      keyword: "Support",
      type: "keyword",
      text: "Support",
    },
  ],
  i18n: mulanFreeSpiritI18n,
};
