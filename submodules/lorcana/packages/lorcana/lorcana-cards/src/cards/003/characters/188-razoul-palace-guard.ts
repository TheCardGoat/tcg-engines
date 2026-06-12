import type { CharacterCard } from "@tcg/lorcana-types";
import { razoulPalaceGuardI18n } from "./188-razoul-palace-guard.i18n";

export const razoulPalaceGuard: CharacterCard = {
  id: "Lj2",
  canonicalId: "ci_Lj2",
  reprints: ["set3-188"],
  cardType: "character",
  name: "Razoul",
  version: "Palace Guard",
  inkType: ["steel"],
  franchise: "Aladdin",
  set: "003",
  cardNumber: 188,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_35f95b92c0ce4e8e85eef87a3edbeb29",
    tcgPlayer: 539114,
  },
  text: [
    {
      title: "LOOKY HERE",
      description: "While this character has no damage, he gets +2 {S}.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Captain"],
  abilities: [
    {
      condition: {
        type: "no-damage",
      },
      effect: {
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1xc-1",
      name: "LOOKY HERE",
      text: "LOOKY HERE While this character has no damage, he gets +2 {S}.",
      type: "static",
    },
  ],
  i18n: razoulPalaceGuardI18n,
};
