import type { CharacterCard } from "@tcg/lorcana-types";

export const plutoCleverCluefinder: CharacterCard = {
  id: "cpr",
  cardType: "character",
  name: "Pluto",
  version: "Clever Cluefinder",
  fullName: "Pluto - Clever Cluefinder",
  inkType: ["sapphire"],
  set: "010",
  text: "ON THE TRAIL {E} — If you have a Detective character in play, return an item card from your discard to your hand. Otherwise, put it on the top of your deck.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 157,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2dd40e3fd534499bc09a776ca3a81b70d12387ea",
  },
  abilities: [
    {
      id: "cpr-1",
      type: "activated",
      cost: { exert: true },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have a Detective character in play",
        },
        then: {
          type: "return-from-discard",
          target: "CONTROLLER",
          cardType: "item",
        },
      },
      text: "ON THE TRAIL {E} — If you have a Detective character in play, return an item card from your discard to your hand. Otherwise, put it on the top of your deck.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
};
