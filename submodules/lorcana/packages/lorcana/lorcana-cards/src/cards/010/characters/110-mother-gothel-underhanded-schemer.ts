import type { CharacterCard } from "@tcg/lorcana-types";
import { motherGothelUnderhandedSchemerI18n } from "./110-mother-gothel-underhanded-schemer.i18n";

export const motherGothelUnderhandedSchemer: CharacterCard = {
  id: "Att",
  canonicalId: "ci_Att",
  reprints: ["set10-110"],
  cardType: "character",
  name: "Mother Gothel",
  version: "Underhanded Schemer",
  inkType: ["ruby"],
  franchise: "Tangled",
  set: "010",
  cardNumber: 110,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_3450ebee9acb4c258e0d161ca6c77010",
    tcgPlayer: 659190,
  },
  text: [
    {
      title: "SOMEBODY'S GOT TO USE IT",
      description: "If a character was banished this turn, this character gets +2 {S}.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  abilities: [
    {
      condition: {
        type: "turn-metric",
        metric: "banished-characters",
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
      id: "1au-1",
      name: "SOMEBODY'S GOT TO USE IT",
      text: "SOMEBODY'S GOT TO USE IT If a character was banished this turn, this character gets +2 {S}.",
      type: "static",
    },
  ],
  i18n: motherGothelUnderhandedSchemerI18n,
};
