import type { CharacterCard } from "@tcg/lorcana";

export const ladyKluckProtectiveConfidant: CharacterCard = {
  id: "18v",
  cardType: "character",
  name: "Lady Kluck",
  version: "Protective Confidant",
  fullName: "Lady Kluck - Protective Confidant",
  inkType: ["sapphire", "steel"],
  franchise: "Robin Hood",
  set: "007",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nWard (Opponents can’t choose this character except to challenge.)",
  cost: 5,
  strength: 2,
  willpower: 7,
  lore: 1,
  cardNumber: 172,
  inkable: true,
  externalIds: {
    ravensburger: "a1c520968878a4659e2e5283c4bb522936f0fa60",
  },
  abilities: [
    {
      id: "18v-1",
      text: "Bodyguard",
      type: "keyword",
      keyword: "Bodyguard",
    },
    {
      id: "18v-2",
      text: "Ward",
      type: "keyword",
      keyword: "Ward",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
