import type { CharacterCard } from "@tcg/lorcana-types";

export const auroraLoreGuardian: CharacterCard = {
  id: "124",
  cardType: "character",
  name: "Aurora",
  version: "Lore Guardian",
  fullName: "Aurora - Lore Guardian",
  inkType: ["sapphire"],
  franchise: "Sleeping Beauty",
  set: "004",
  text: "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Aurora.)\nPRESERVER Opponents can't choose your items for abilities or effects.\nROYAL INVENTORY {E} one of your items — Look at the top card of your deck and put it on either the top or the bottom of your deck.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 140,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8a04e29b3d058277b73ebe312aa9cf6677675652",
  },
  abilities: [
    {
      id: "124-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 2,
      },
      text: "Shift 2",
    },
    {
      id: "124-3",
      type: "activated",
      effect: {
        type: "put-on-bottom",
        target: "CHOSEN_CHARACTER",
      },
      text: "ROYAL INVENTORY {E} one of your items — Look at the top card of your deck and put it on either the top or the bottom of your deck.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Princess"],
};
