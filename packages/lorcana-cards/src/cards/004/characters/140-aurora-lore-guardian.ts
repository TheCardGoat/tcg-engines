import type { CharacterCard } from "@tcg/lorcana-types";

export const auroraLoreGuardian: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 2,
      },
      id: "124-1",
      keyword: "Shift",
      text: "Shift 2",
      type: "keyword",
    },
    {
      cost: {
        exert: true,
      },
      effect: {
        target: "CHOSEN_CHARACTER",
        type: "put-on-bottom",
      },
      id: "124-3",
      text: "ROYAL INVENTORY {E} one of your items — Look at the top card of your deck and put it on either the top or the bottom of your deck.",
      type: "activated",
    },
  ],
  cardNumber: 140,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Princess"],
  cost: 4,
  externalIds: {
    ravensburger: "8a04e29b3d058277b73ebe312aa9cf6677675652",
  },
  franchise: "Sleeping Beauty",
  fullName: "Aurora - Lore Guardian",
  id: "124",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingImplementation: true,
  missingTests: true,
  name: "Aurora",
  set: "004",
  strength: 3,
  text: "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Aurora.)\nPRESERVER Opponents can't choose your items for abilities or effects.\nROYAL INVENTORY {E} one of your items — Look at the top card of your deck and put it on either the top or the bottom of your deck.",
  version: "Lore Guardian",
  willpower: 3,
};
