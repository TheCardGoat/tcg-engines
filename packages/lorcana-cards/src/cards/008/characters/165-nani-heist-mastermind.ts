import type { CharacterCard } from "@tcg/lorcana-types";

export const naniHeistMastermind: CharacterCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        value: 2,
        duration: "this-turn",
      },
      id: "d2e-1",
      text: "STICK TO THE PLAN {E} — Another chosen character gains Resist +2 this turn.",
      type: "activated",
    },
    {
      effect: {
        type: "gain-keyword",
        keyword: "Support",
        target: "YOUR_CHARACTERS",
      },
      id: "d2e-2",
      text: "IT'S UP TO YOU, LILO Your characters named Lilo gain Support.",
      type: "action",
    },
  ],
  cardNumber: 165,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 4,
  externalIds: {
    ravensburger: "2f18349b85491e5971a0a7786eb658f2610a58ae",
  },
  franchise: "Lilo and Stitch",
  fullName: "Nani - Heist Mastermind",
  id: "d2e",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Nani",
  set: "008",
  strength: 3,
  text: "STICK TO THE PLAN {E} — Another chosen character gains Resist +2 this turn. (Damage dealt to them is reduced by 2.)\nIT'S UP TO YOU, LILO Your characters named Lilo gain Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
  version: "Heist Mastermind",
  willpower: 3,
};
