import type { CharacterCard } from "@tcg/lorcana-types";

export const naniHeistMastermind: CharacterCard = {
  id: "d2e",
  cardType: "character",
  name: "Nani",
  version: "Heist Mastermind",
  fullName: "Nani - Heist Mastermind",
  inkType: ["sapphire"],
  franchise: "Lilo and Stitch",
  set: "008",
  text: "STICK TO THE PLAN {E} — Another chosen character gains Resist +2 this turn. (Damage dealt to them is reduced by 2.)\nIT'S UP TO YOU, LILO Your characters named Lilo gain Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 165,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2f18349b85491e5971a0a7786eb658f2610a58ae",
  },
  abilities: [
    {
      id: "d2e-1",
      type: "activated",
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
      text: "STICK TO THE PLAN {E} — Another chosen character gains Resist +2 this turn.",
    },
    {
      id: "d2e-2",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Support",
        target: "YOUR_CHARACTERS",
      },
      text: "IT'S UP TO YOU, LILO Your characters named Lilo gain Support.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
