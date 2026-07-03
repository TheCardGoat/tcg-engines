import type { CharacterCard } from "@tcg/lorcana-types";
import { plutoTriedAndTrueP2PromoI18n } from "./p2-027-pluto-tried-and-true-promo.i18n";

export const plutoTriedAndTrueP2Promo: CharacterCard = {
  id: "ThD",
  canonicalId: "ci_BzW",
  slug: "lorcana-ci_BzW",
  printings: [
    {
      id: "set8-p2-027-promo",
      artId: "ci_BzW-promo",
      setCode: "set8",
      collectorNumber: "27",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set8-028"],
  cardType: "character",
  name: "Pluto",
  version: "Tried and True",
  inkType: ["amber", "steel"],
  set: "008",
  cardNumber: 27,
  rarity: "special",
  specialRarity: "promo",
  cost: 6,
  strength: 2,
  willpower: 7,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_1d9e80fa46b14aaea261d56a602224ba",
    tcgPlayer: "631370",
  },
  text: [
    {
      title: "HAPPY HELPER",
      description:
        "While this character has no damage, he gets +2 {S} and gains Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
    },
  ],
  classifications: ["Storyborn", "Ally"],
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
      id: "3hj-1",
      name: "HAPPY HELPER",
      text: "HAPPY HELPER While this character has no damage, he gets +2 {S} and gains Support.",
      type: "static",
    },
    {
      condition: {
        type: "no-damage",
      },
      effect: {
        keyword: "Support",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "3hj-2",
      name: "HAPPY HELPER",
      text: "HAPPY HELPER While this character has no damage, he gets +2 {S} and gains Support.",
      type: "static",
    },
  ],
  i18n: plutoTriedAndTrueP2PromoI18n,
};
