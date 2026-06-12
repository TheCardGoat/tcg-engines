import type { CharacterCard } from "@tcg/lorcana-types";
import { copperOnTheScentI18n } from "./107-copper-on-the-scent.i18n";
import { rush } from "../../../helpers/abilities/rush";
import { reckless } from "../../../helpers/abilities/reckless";

export const copperOnTheScent: CharacterCard = {
  id: "5td",
  canonicalId: "ci_5td",
  reprints: ["set11-107"],
  cardType: "character",
  name: "Copper",
  version: "On the Scent",
  inkType: ["ruby"],
  franchise: "Fox and the Hound",
  set: "011",
  cardNumber: 107,
  rarity: "uncommon",
  cost: 6,
  strength: 8,
  willpower: 5,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_f5ec9aa34cb2438fb19806535e9ffcc5",
    tcgPlayer: 675496,
  },
  text: [
    {
      title: "Rush",
    },
    {
      title: "Reckless",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [rush, reckless],
  i18n: copperOnTheScentI18n,
};
