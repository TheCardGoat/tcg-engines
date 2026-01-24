import type { CharacterCard } from "@tcg/lorcana-types";

export const shereKhanFierceAndFurious: CharacterCard = {
  id: "1uf",
  cardType: "character",
  name: "Shere Khan",
  version: "Fierce and Furious",
  fullName: "Shere Khan - Fierce and Furious",
  inkType: ["ruby"],
  franchise: "Jungle Book",
  set: "010",
  text: "Shift 5 {I} (You may pay 5 {I} to play this on top of one of your characters named Shere Khan.)\nWILD RAGE 1 {I}, Deal 1 damage to this character — Ready this character. He can't quest for the rest of this turn.",
  cost: 8,
  strength: 8,
  willpower: 8,
  lore: 2,
  cardNumber: 128,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ef72f964d64111f6e9cb2f86c285f530b47afe0c",
  },
  abilities: [
    {
      id: "1uf-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 5,
      },
      text: "Shift 5 {I}",
    },
    {
      id: "1uf-2",
      type: "activated",
      cost: { exert: true },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "deal-damage",
            amount: 1,
            target: {
              selector: "self",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "restriction",
            restriction: "cant-quest",
            target: "SELF",
            duration: "this-turn",
          },
        ],
      },
      text: "WILD RAGE 1 {I}, Deal 1 damage to this character — Ready this character. He can't quest for the rest of this turn.",
    },
  ],
  classifications: ["Floodborn", "Villain"],
};
