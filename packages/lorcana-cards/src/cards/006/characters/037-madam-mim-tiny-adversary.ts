import type { CharacterCard } from "@tcg/lorcana-types";

export const madamMimTinyAdversary: CharacterCard = {
  abilities: [
    {
      id: "jgv-1",
      keyword: "Challenger",
      text: "Challenger +1",
      type: "keyword",
      value: 1,
    },
    {
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        target: "YOUR_CHARACTERS",
        value: 1,
      },
      id: "jgv-2",
      name: "ZIM ZABBERIM ZIM Your other",
      text: "ZIM ZABBERIM ZIM Your other characters gain Challenger +1.",
      type: "static",
    },
  ],
  cardNumber: 37,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  cost: 2,
  externalIds: {
    ravensburger: "462aeda1519544194de59f6734300225a5c89003",
  },
  franchise: "Sword in the Stone",
  fullName: "Madam Mim - Tiny Adversary",
  id: "jgv",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Madam Mim",
  set: "006",
  strength: 0,
  text: "Challenger +1 (While challenging, this character gets +1 {S}.)\nZIM ZABBERIM ZIM Your other characters gain Challenger +1.",
  version: "Tiny Adversary",
  willpower: 3,
};
