import type { CharacterCard } from "@tcg/lorcana-types";
import { maximusPalaceHorseI18n } from "./010-maximus-palace-horse.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";
import { support } from "../../../helpers/abilities/support";

export const maximusPalaceHorse: CharacterCard = {
  id: "A1E",
  canonicalId: "ci_A1E",
  reprints: ["set1-010"],
  cardType: "character",
  name: "Maximus",
  version: "Palace Horse",
  inkType: ["amber"],
  franchise: "Tangled",
  set: "001",
  cardNumber: 10,
  rarity: "common",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_1d41bcb819ef4f12b40b5aab332e0c4c",
    tcgPlayer: 506837,
  },
  text: [
    {
      title: "Bodyguard",
    },
    {
      title: "Support",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [bodyguard, support],
  i18n: maximusPalaceHorseI18n,
};
