import type { CharacterCard } from "@tcg/lorcana";

export const jimDearBelovedHusband: CharacterCard = {
  id: "cft",
  cardType: "character",
  name: "Jim Dear",
  version: "Beloved Husband",
  fullName: "Jim Dear - Beloved Husband",
  inkType: ["amber"],
  franchise: "Lady and the Tramp",
  set: "008",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  cardNumber: "012",
  cost: 2,
  strength: 0,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    ravensburger: "2cd509bc3d4a9b911eb07cec23d5037de65bf673",
  },
  keywords: ["Bodyguard"],
  abilities: [
    {
      id: "cfta1",
      text: "Bodyguard",
      type: "static",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
