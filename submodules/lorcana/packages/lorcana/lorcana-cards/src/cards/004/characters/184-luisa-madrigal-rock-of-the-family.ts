import type { CharacterCard } from "@tcg/lorcana-types";
import { luisaMadrigalRockOfTheFamilyI18n } from "./184-luisa-madrigal-rock-of-the-family.i18n";

export const luisaMadrigalRockOfTheFamily: CharacterCard = {
  id: "sIB",
  canonicalId: "ci_sIB",
  reprints: ["set4-184"],
  cardType: "character",
  name: "Luisa Madrigal",
  version: "Rock of the Family",
  inkType: ["steel"],
  franchise: "Encanto",
  set: "004",
  cardNumber: 184,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_308aa649ad114f3195d950a5a60586c2",
    tcgPlayer: 547174,
  },
  text: [
    {
      title: "I'M THE STRONG ONE",
      description: "While you have another character in play, this character gets +2 {S}.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Madrigal"],
  abilities: [
    {
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          excludeSelf: true,
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "10a-1",
      name: "I'M THE STRONG ONE",
      text: "I'M THE STRONG ONE While you have another character in play, this character gets +2 {S}.",
      type: "static",
    },
  ],
  i18n: luisaMadrigalRockOfTheFamilyI18n,
};
