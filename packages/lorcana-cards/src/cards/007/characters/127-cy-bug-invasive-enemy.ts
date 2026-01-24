import type { CharacterCard } from "@tcg/lorcana-types";

export const cybugInvasiveEnemy: CharacterCard = {
  id: "1ls",
  cardType: "character",
  name: "Cy-Bug",
  version: "Invasive Enemy",
  fullName: "Cy-Bug - Invasive Enemy",
  inkType: ["ruby"],
  franchise: "Wreck It Ralph",
  set: "007",
  text: "HIVE MIND This character gets +1 {S} for each other character you have in play.",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 127,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d03d06aac96130ef91033f5aba0d28d7ade58cdc",
  },
  abilities: [
    {
      id: "1ls-1",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "SELF",
      },
      text: "HIVE MIND This character gets +1 {S} for each other character you have in play.",
    },
  ],
  classifications: ["Storyborn"],
};
