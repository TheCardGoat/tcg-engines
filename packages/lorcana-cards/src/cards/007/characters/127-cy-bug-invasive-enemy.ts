import type { CharacterCard } from "@tcg/lorcana-types";

export const cybugInvasiveEnemy: CharacterCard = {
  abilities: [
    {
      effect: {
        modifier: 1,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1ls-1",
      text: "HIVE MIND This character gets +1 {S} for each other character you have in play.",
      type: "static",
    },
  ],
  cardNumber: 127,
  cardType: "character",
  classifications: ["Storyborn"],
  cost: 2,
  externalIds: {
    ravensburger: "d03d06aac96130ef91033f5aba0d28d7ade58cdc",
  },
  franchise: "Wreck It Ralph",
  fullName: "Cy-Bug - Invasive Enemy",
  id: "1ls",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Cy-Bug",
  set: "007",
  strength: 1,
  text: "HIVE MIND This character gets +1 {S} for each other character you have in play.",
  version: "Invasive Enemy",
  willpower: 2,
};
