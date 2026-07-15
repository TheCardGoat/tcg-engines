import type { CharacterCard } from "@tcg/lorcana-types";

export const clarabelleLightOnHerHooves: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 5,
      },
      id: "1dt-1",
      keyword: "Shift",
      text: "Shift 5",
      type: "keyword",
    },
  ],
  cardNumber: 84,
  cardType: "character",
  classifications: ["Floodborn", "Ally"],
  cost: 7,
  externalIds: {
    ravensburger: "b38a4856ba9e1a52fe3f980304c83bf8c74f7a15",
  },
  fullName: "Clarabelle - Light on Her Hooves",
  id: "1dt",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  missingImplementation: true,
  missingTests: true,
  name: "Clarabelle",
  set: "005",
  strength: 5,
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Clarabelle.)\nKEEP IN STEP At the end of your turn, if chosen opponent has more cards in their hand than you, you may draw cards until you have the same number.",
  version: "Light on Her Hooves",
  willpower: 6,
};
