import type { CharacterCard } from "@tcg/lorcana-types";

export const madamMimTinyAdversary: CharacterCard = {
  id: "jgv",
  cardType: "character",
  name: "Madam Mim",
  version: "Tiny Adversary",
  fullName: "Madam Mim - Tiny Adversary",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "006",
  text: "Challenger +1 (While challenging, this character gets +1 {S}.)\nZIM ZABBERIM ZIM Your other characters gain Challenger +1.",
  cost: 2,
  strength: 0,
  willpower: 3,
  lore: 1,
  cardNumber: 37,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "462aeda1519544194de59f6734300225a5c89003",
  },
  abilities: [
    {
      id: "jgv-1",
      type: "keyword",
      keyword: "Challenger",
      value: 1,
      text: "Challenger +1",
    },
    {
      id: "jgv-2",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        target: "YOUR_CHARACTERS",
        value: 1,
      },
      name: "ZIM ZABBERIM ZIM Your other",
      text: "ZIM ZABBERIM ZIM Your other characters gain Challenger +1.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};
