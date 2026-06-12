import type { CharacterCard } from "@tcg/lorcana-types";
import { belleBookwormI18n } from "./071-belle-bookworm.i18n";

export const belleBookworm: CharacterCard = {
  id: "cql",
  canonicalId: "ci_cql",
  reprints: ["set2-071"],
  cardType: "character",
  name: "Belle",
  version: "Bookworm",
  inkType: ["emerald"],
  franchise: "Beauty and the Beast",
  set: "002",
  cardNumber: 71,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_1379d064484a4269bc01c74fd935c221",
    tcgPlayer: 525246,
  },
  text: [
    {
      title: "USE YOUR IMAGINATION",
      description: "While an opponent has no cards in their hand, this character gets +2 {L}.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      id: "1rv-1",
      name: "USE YOUR IMAGINATION",
      text: "USE YOUR IMAGINATION While an opponent has no cards in their hand, this character gets +2 {L}.",
      type: "static",
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "opponent",
          zones: ["hand"],
        },
        comparison: {
          operator: "eq",
          value: 0,
        },
      },
      effect: {
        modifier: 2,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
    },
  ],
  i18n: belleBookwormI18n,
};
