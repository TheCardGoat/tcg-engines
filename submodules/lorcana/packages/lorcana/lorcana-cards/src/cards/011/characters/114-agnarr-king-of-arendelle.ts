import type { CharacterCard } from "@tcg/lorcana-types";
import { agnarrKingOfArendelleI18n } from "./114-agnarr-king-of-arendelle.i18n";

export const agnarrKingOfArendelle: CharacterCard = {
  id: "8bt",
  canonicalId: "ci_8bt",
  reprints: ["set11-114"],
  cardType: "character",
  name: "Agnarr",
  version: "King of Arendelle",
  inkType: ["ruby"],
  franchise: "Frozen",
  set: "011",
  cardNumber: 114,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_9315eb79ba14485fa0ecc0b6dcabd054",
    tcgPlayer: 675500,
  },
  text: [
    {
      title: "PROTECTIVE INSTINCT",
      description: "While you have a Queen character in play, this character gets +2 {S}.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "King"],
  abilities: [
    {
      id: "1bq-1",
      name: "PROTECTIVE INSTINCT",
      type: "static",
      condition: {
        type: "has-character-count",
        controller: "you",
        comparison: "or-more",
        count: 1,
        classification: "Queen",
      },
      effect: {
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      text: "PROTECTIVE INSTINCT While you have a Queen character in play, this character gets +2 {S}.",
    },
  ],
  i18n: agnarrKingOfArendelleI18n,
};
