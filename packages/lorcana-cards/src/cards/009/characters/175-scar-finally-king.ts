import type { CharacterCard } from "@tcg/lorcana-types";

export const scarFinallyKing: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "YOUR_CHARACTERS",
      },
      id: "1vp-1",
      name: "BE GRATEFUL Your Ally",
      text: "BE GRATEFUL Your Ally characters get +1 {S}.",
      type: "static",
    },
    {
      effect: {
        type: "discard",
        amount: 2,
        target: "CONTROLLER",
        chosen: false,
      },
      id: "1vp-2",
      text: "STICK WITH ME At the end of your turn, if this character is exerted, you may draw cards equal to the {S} of chosen Ally character of yours. If you do, choose and discard 2 cards and banish that character.",
      type: "action",
    },
  ],
  cardNumber: 175,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "King"],
  cost: 5,
  externalIds: {
    ravensburger: "f404fb42744a106cf9e025ae2d99c20b3ee53cef",
  },
  franchise: "Lion King",
  fullName: "Scar - Finally King",
  id: "1vp",
  inkType: ["steel"],
  inkable: false,
  lore: 2,
  name: "Scar",
  set: "009",
  strength: 5,
  text: "BE GRATEFUL Your Ally characters get +1 {S}.\nSTICK WITH ME At the end of your turn, if this character is exerted, you may draw cards equal to the {S} of chosen Ally character of yours. If you do, choose and discard 2 cards and banish that character.",
  version: "Finally King",
  willpower: 4,
};
