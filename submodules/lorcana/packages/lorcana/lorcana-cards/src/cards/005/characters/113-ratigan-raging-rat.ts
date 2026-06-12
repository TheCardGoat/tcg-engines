import type { CharacterCard } from "@tcg/lorcana-types";
import { ratiganRagingRatI18n } from "./113-ratigan-raging-rat.i18n";

export const ratiganRagingRat: CharacterCard = {
  id: "A6r",
  canonicalId: "ci_A6r",
  reprints: ["set5-113"],
  cardType: "character",
  name: "Ratigan",
  version: "Raging Rat",
  inkType: ["ruby"],
  franchise: "Great Mouse Detective",
  set: "005",
  cardNumber: 113,
  rarity: "common",
  cost: 3,
  strength: 1,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_833361002e2a4571b9d12ba392560b16",
    tcgPlayer: 561636,
  },
  text: [
    {
      title: "NOTHING CAN STAND IN MY WAY",
      description: "While this character has damage, he gets +2 {S}.",
    },
  ],
  classifications: ["Dreamborn", "Villain"],
  abilities: [
    {
      condition: {
        type: "self-has-damage",
      },
      effect: {
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1g7-1",
      name: "NOTHING CAN STAND IN MY WAY",
      text: "NOTHING CAN STAND IN MY WAY While this character has damage, he gets +2 {S}.",
      type: "static",
    },
  ],
  i18n: ratiganRagingRatI18n,
};
