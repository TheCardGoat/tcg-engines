import type { CharacterCard } from "@tcg/lorcana-types";

export const johnSilverSternCaptain: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 5,
      },
      id: "19b-1",
      keyword: "Shift",
      text: "Shift 5",
      type: "keyword",
    },
    {
      id: "19b-2",
      keyword: "Resist",
      text: "Resist +2",
      type: "keyword",
      value: 2,
    },
    {
      effect: {
        amount: 1,
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "deal-damage",
      },
      id: "19b-3",
      text: "DON'T JUST SIT THERE! At the start of your turn, deal 1 damage to each opposing ready character.",
      type: "action",
    },
  ],
  cardNumber: 194,
  cardType: "character",
  classifications: ["Floodborn", "Villain", "Alien", "Pirate", "Captain"],
  cost: 8,
  externalIds: {
    ravensburger: "a35533a3e2773a11318e05fb7d0179e1f4f32b3d",
  },
  franchise: "Treasure Planet",
  fullName: "John Silver - Stern Captain",
  id: "19b",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "John Silver",
  set: "006",
  strength: 6,
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named John Silver.)\nResist +2 (Damage dealt to this character is reduced by 2.)\nDON'T JUST SIT THERE! At the start of your turn, deal 1 damage to each opposing ready character.",
  version: "Stern Captain",
  willpower: 6,
};
