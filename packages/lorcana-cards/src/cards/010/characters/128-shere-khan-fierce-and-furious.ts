import type { CharacterCard } from "@tcg/lorcana-types";

export const shereKhanFierceAndFurious: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 5,
      },
      id: "1uf-1",
      keyword: "Shift",
      text: "Shift 5 {I}",
      type: "keyword",
    },
    {
      cost: { exert: true },
      effect: {
        steps: [
          {
            amount: 1,
            target: {
              selector: "self",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "deal-damage",
          },
          {
            duration: "this-turn",
            restriction: "cant-quest",
            target: "SELF",
            type: "restriction",
          },
        ],
        type: "sequence",
      },
      id: "1uf-2",
      text: "WILD RAGE 1 {I}, Deal 1 damage to this character — Ready this character. He can't quest for the rest of this turn.",
      type: "activated",
    },
  ],
  cardNumber: 128,
  cardType: "character",
  classifications: ["Floodborn", "Villain"],
  cost: 8,
  externalIds: {
    ravensburger: "ef72f964d64111f6e9cb2f86c285f530b47afe0c",
  },
  franchise: "Jungle Book",
  fullName: "Shere Khan - Fierce and Furious",
  id: "1uf",
  inkType: ["ruby"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Shere Khan",
  set: "010",
  strength: 8,
  text: "Shift 5 {I} (You may pay 5 {I} to play this on top of one of your characters named Shere Khan.)\nWILD RAGE 1 {I}, Deal 1 damage to this character — Ready this character. He can't quest for the rest of this turn.",
  version: "Fierce and Furious",
  willpower: 8,
};
