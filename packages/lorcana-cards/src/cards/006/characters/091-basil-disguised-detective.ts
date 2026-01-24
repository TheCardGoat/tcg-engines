import type { CharacterCard } from "@tcg/lorcana-types";

export const basilDisguisedDetective: CharacterCard = {
  id: "fop",
  cardType: "character",
  name: "Basil",
  version: "Disguised Detective",
  fullName: "Basil - Disguised Detective",
  inkType: ["emerald"],
  franchise: "Great Mouse Detective",
  set: "006",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Basil.)\nTWISTS AND TURNS During your turn, whenever a card is put into your inkwell, you may pay 1 {I} to have chosen opponent choose and discard a card.",
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 2,
  cardNumber: 91,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3888d0922245bc3a1bdc014b65a50848f7973819",
  },
  abilities: [
    {
      id: "fop-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
      text: "Shift 4",
    },
    {
      id: "fop-2",
      type: "triggered",
      name: "TWISTS AND TURNS",
      effect: {
        type: "optional",
        effect: {
          type: "discard",
          amount: 1,
          target: "CONTROLLER",
          chosen: true,
        },
        chooser: "CONTROLLER",
      },
      text: "TWISTS AND TURNS During your turn, whenever a card is put into your inkwell, you may pay 1 {I} to have chosen opponent choose and discard a card.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Detective"],
};
