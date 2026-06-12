import type { CharacterCard } from "@tcg/lorcana-types";
import { lingImperialSoldierI18n } from "./183-ling-imperial-soldier.i18n";

export const lingImperialSoldier: CharacterCard = {
  id: "HyV",
  canonicalId: "ci_HyV",
  reprints: ["set4-183"],
  cardType: "character",
  name: "Ling",
  version: "Imperial Soldier",
  inkType: ["steel"],
  franchise: "Mulan",
  set: "004",
  cardNumber: 183,
  rarity: "uncommon",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_b99de29dfb744a0184319f957208d126",
    tcgPlayer: 548195,
  },
  text: [
    {
      title: "FULL OF SPIRIT",
      description: "Your Hero characters get +1 {S}.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        modifier: 1,
        stat: "strength",
        target: "YOUR_HERO_CHARACTERS",
        type: "modify-stat",
      },
      id: "joz-1",
      name: "FULL OF SPIRIT",
      text: "FULL OF SPIRIT Your Hero characters get +1 {S}.",
      type: "static",
    },
  ],
  i18n: lingImperialSoldierI18n,
};
