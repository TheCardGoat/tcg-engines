import type { CharacterCard } from "@tcg/lorcana-types";
import { nalaUndauntedLionessI18n } from "./173-nala-undaunted-lioness.i18n";

export const nalaUndauntedLioness: CharacterCard = {
  id: "XTr",
  canonicalId: "ci_XTr",
  reprints: ["set9-173"],
  cardType: "character",
  name: "Nala",
  version: "Undaunted Lioness",
  inkType: ["steel"],
  franchise: "Lion King",
  set: "009",
  cardNumber: 173,
  rarity: "rare",
  cost: 2,
  strength: 0,
  willpower: 2,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_11287d0d009b455ba9cde545d4f98c5b",
    tcgPlayer: 650107,
  },
  text: [
    {
      title: "DETERMINED DIVERSION",
      description: "While this character has no damage, she gets +1 {L} and gains Resist +1.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      condition: {
        type: "no-damage",
      },
      effect: {
        modifier: 1,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1xs-1",
      name: "DETERMINED DIVERSION",
      text: "DETERMINED DIVERSION While this character has no damage, she gets +1 {L} and gains Resist +1.",
      type: "static",
    },
    {
      condition: {
        type: "no-damage",
      },
      effect: {
        keyword: "Resist",
        target: "SELF",
        type: "gain-keyword",
        value: 1,
      },
      id: "1xs-2",
      name: "DETERMINED DIVERSION",
      text: "DETERMINED DIVERSION While this character has no damage, she gets +1 {L} and gains Resist +1.",
      type: "static",
    },
  ],
  i18n: nalaUndauntedLionessI18n,
};
