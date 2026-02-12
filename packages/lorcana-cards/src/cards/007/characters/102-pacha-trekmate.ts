import type { CharacterCard } from "@tcg/lorcana-types";

export const pachaTrekmate: CharacterCard = {
  abilities: [
    {
      effect: {
        modifier: 2,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "19c-1",
      text: "FULL PACK While you have more cards in your hand than each opponent, this character gets +2 {L}.",
      type: "action",
    },
  ],
  cardNumber: 102,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 3,
  externalIds: {
    ravensburger: "a375827e674b232f0d824d876ebddaaa0e37b54c",
  },
  franchise: "Emperors New Groove",
  fullName: "Pacha - Trekmate",
  id: "19c",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Pacha",
  set: "007",
  strength: 3,
  text: "FULL PACK While you have more cards in your hand than each opponent, this character gets +2 {L}.",
  version: "Trekmate",
  willpower: 2,
};
