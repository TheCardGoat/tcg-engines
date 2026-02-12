import type { CharacterCard } from "@tcg/lorcana-types";

export const plutoCleverCluefinder: CharacterCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        condition: {
          type: "if",
          expression: "you have a Detective character in play",
        },
        then: {
          type: "return-from-discard",
          target: "CONTROLLER",
          cardType: "item",
        },
        type: "conditional",
      },
      id: "cpr-1",
      text: "ON THE TRAIL {E} — If you have a Detective character in play, return an item card from your discard to your hand. Otherwise, put it on the top of your deck.",
      type: "activated",
    },
  ],
  cardNumber: 157,
  cardType: "character",
  classifications: ["Dreamborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "2dd40e3fd534499bc09a776ca3a81b70d12387ea",
  },
  fullName: "Pluto - Clever Cluefinder",
  id: "cpr",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Pluto",
  set: "010",
  strength: 2,
  text: "ON THE TRAIL {E} — If you have a Detective character in play, return an item card from your discard to your hand. Otherwise, put it on the top of your deck.",
  version: "Clever Cluefinder",
  willpower: 2,
};
