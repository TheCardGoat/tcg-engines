import type { CharacterCard } from "@tcg/lorcana-types";
import { cogsworthClimbingClockI18n } from "./130-cogsworth-climbing-clock.i18n";

export const cogsworthClimbingClock: CharacterCard = {
  id: "ATx",
  canonicalId: "ci_ATx",
  reprints: ["set7-130"],
  cardType: "character",
  name: "Cogsworth",
  version: "Climbing Clock",
  inkType: ["ruby"],
  franchise: "Beauty and the Beast",
  set: "007",
  cardNumber: 130,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_7e99e5b9bd2747d29e6393aff2685158",
    tcgPlayer: 619477,
  },
  text: [
    {
      title: "STILL USEFUL",
      description: "While you have an item card in your discard, this character gets +2 {S}.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["discard"],
          cardTypes: ["item"],
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      id: "1th-1",
      name: "STILL USEFUL",
      text: "STILL USEFUL While you have an item card in your discard, this character gets +2 {S}.",
      type: "static",
    },
  ],
  i18n: cogsworthClimbingClockI18n,
};
