import type { CharacterCard } from "@tcg/lorcana-types";
import { viranaFangChiefI18n } from "./095-virana-fang-chief.i18n";

export const viranaFangChief: CharacterCard = {
  id: "3ZI",
  canonicalId: "ci_N3z",
  reprints: ["set2-095", "set9-082"],
  cardType: "character",
  name: "Virana",
  version: "Fang Chief",
  inkType: ["emerald"],
  franchise: "Raya and the Last Dragon",
  set: "002",
  cardNumber: 95,
  rarity: "common",
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_6b025bc8b17a487c8e3b40067851f9b9",
    tcgPlayer: 650022,
  },
  classifications: ["Storyborn", "Villain", "Queen"],
  i18n: viranaFangChiefI18n,
};
