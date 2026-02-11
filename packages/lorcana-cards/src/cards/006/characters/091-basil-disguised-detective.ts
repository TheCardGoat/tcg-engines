import type { CharacterCard } from "@tcg/lorcana-types";

export const basilDisguisedDetective: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 4,
      },
      id: "fop-1",
      keyword: "Shift",
      text: "Shift 4",
      type: "keyword",
    },
    {
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
      id: "fop-2",
      name: "TWISTS AND TURNS",
      text: "TWISTS AND TURNS During your turn, whenever a card is put into your inkwell, you may pay 1 {I} to have chosen opponent choose and discard a card.",
      trigger: { event: "play", timing: "when", on: "SELF" },
      type: "triggered",
    },
  ],
  cardNumber: 91,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Detective"],
  cost: 6,
  externalIds: {
    ravensburger: "3888d0922245bc3a1bdc014b65a50848f7973819",
  },
  franchise: "Great Mouse Detective",
  fullName: "Basil - Disguised Detective",
  id: "fop",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Basil",
  set: "006",
  strength: 4,
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Basil.)\nTWISTS AND TURNS During your turn, whenever a card is put into your inkwell, you may pay 1 {I} to have chosen opponent choose and discard a card.",
  version: "Disguised Detective",
  willpower: 5,
};
