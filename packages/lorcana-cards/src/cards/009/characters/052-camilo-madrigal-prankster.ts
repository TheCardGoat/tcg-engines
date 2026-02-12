import type { CharacterCard } from "@tcg/lorcana-types";

export const camiloMadrigalPrankster: CharacterCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1vj-2",
      text: "- This character gets +1 {L} this turn.",
      type: "action",
    },
    {
      effect: {
        duration: "this-turn",
        keyword: "Challenger",
        target: "SELF",
        type: "gain-keyword",
        value: 2,
      },
      id: "1vj-3",
      text: "- This character gains Challenger +2 this turn.",
      type: "action",
    },
  ],
  cardNumber: 52,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Madrigal"],
  cost: 4,
  externalIds: {
    ravensburger: "06c33d8303cbe3698922ef017c553b693cb45e56",
  },
  franchise: "Encanto",
  fullName: "Camilo Madrigal - Prankster",
  id: "1vj",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingImplementation: true,
  missingTests: true,
  name: "Camilo Madrigal",
  set: "009",
  strength: 2,
  text: "MANY FORMS At the start of your turn, you may choose one:\n- This character gets +1 {L} this turn.\n- This character gains Challenger +2 this turn.\n(While challenging, this character gets +2 {S}.)",
  version: "Prankster",
  willpower: 5,
};
