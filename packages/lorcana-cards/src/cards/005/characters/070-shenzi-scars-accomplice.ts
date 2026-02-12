import type { CharacterCard } from "@tcg/lorcana-types";

export const shenziScarsAccomplice: CharacterCard = {
  abilities: [
    {
      id: "1nr-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1nr-2",
      text: "EASY PICKINGS While challenging a damaged character, this character gets +2 {S}.",
      type: "action",
    },
  ],
  cardNumber: 70,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Hyena"],
  cost: 3,
  externalIds: {
    ravensburger: "d76d53b25e89ba4480b569e40a9053d73d50bb2f",
  },
  franchise: "Lion King",
  fullName: "Shenzi - Scar's Accomplice",
  id: "1nr",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Shenzi",
  set: "005",
  strength: 2,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nEASY PICKINGS While challenging a damaged character, this character gets +2 {S}.",
  version: "Scar's Accomplice",
  willpower: 3,
};
