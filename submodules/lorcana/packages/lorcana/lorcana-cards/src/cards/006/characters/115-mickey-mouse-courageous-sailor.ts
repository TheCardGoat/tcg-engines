import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMouseCourageousSailorI18n } from "./115-mickey-mouse-courageous-sailor.i18n";

export const mickeyMouseCourageousSailor: CharacterCard = {
  id: "N8b",
  canonicalId: "ci_N8b",
  reprints: ["set6-115"],
  cardType: "character",
  name: "Mickey Mouse",
  version: "Courageous Sailor",
  inkType: ["ruby"],
  set: "006",
  cardNumber: 115,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_01d728f9a98643378187ab0151a89b06",
    tcgPlayer: 586979,
  },
  text: [
    {
      title: "SOLID GROUND",
      description: "While this character is at a location, he gets +2 {S}.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    {
      condition: {
        type: "at-location",
      },
      effect: {
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "wqx-1",
      name: "SOLID GROUND",
      text: "SOLID GROUND While this character is at a location, he gets +2 {S}.",
      type: "static",
    },
  ],
  i18n: mickeyMouseCourageousSailorI18n,
};
