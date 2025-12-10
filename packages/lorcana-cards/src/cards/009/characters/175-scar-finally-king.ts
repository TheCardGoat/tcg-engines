import type { CharacterCard } from "@tcg/lorcana";

export const scarFinallyKing: CharacterCard = {
  id: "1vp",
  cardType: "character",
  name: "Scar",
  version: "Finally King",
  fullName: "Scar - Finally King",
  inkType: ["steel"],
  franchise: "Lion King",
  set: "009",
  text: "BE GRATEFUL Your Ally characters get +1 {S}.\nSTICK WITH ME At the end of your turn, if this character is exerted, you may draw cards equal to the {S} of chosen Ally character of yours. If you do, choose and discard 2 cards and banish that character.",
  cost: 5,
  strength: 5,
  willpower: 4,
  lore: 2,
  cardNumber: 175,
  inkable: false,
  externalIds: {
    ravensburger: "f404fb42744a106cf9e025ae2d99c20b3ee53cef",
  },
  abilities: [
    {
      id: "1vp-1",
      text: "BE GRATEFUL Your Ally characters get +1 {S}.",
      name: "BE GRATEFUL",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "YOUR_CHARACTERS",
        duration: "while-condition",
      },
    },
    {
      id: "1vp-2",
      text: "STICK WITH ME At the end of your turn, if this character is exerted, you may draw cards equal to the {S} of chosen Ally character of yours. If you do, choose and discard 2 cards and banish that character.",
      name: "STICK WITH ME",
      type: "triggered",
      trigger: {
        event: "end-turn",
        timing: "at",
        on: "YOU",
      },
      effect: {
        type: "optional",
        effect: {
          type: "discard",
          amount: 2,
          target: "CONTROLLER",
          chosen: true,
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Storyborn", "Villain", "King"],
};
