import type { CharacterCard } from "@tcg/lorcana-types";

export const montereyJackDefiantProtector: CharacterCard = {
  id: "1s2",
  cardType: "character",
  name: "Monterey Jack",
  version: "Defiant Protector",
  fullName: "Monterey Jack - Defiant Protector",
  inkType: ["steel"],
  franchise: "Rescue Rangers",
  set: "008",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 2,
  cardNumber: 188,
  inkable: true,
  externalIds: {
    ravensburger: "0669c45afa1ed8a75915fc48406f8c1f601cc2db",
  },
  abilities: [
    {
      id: "1s2-1",
      text: "Bodyguard",
      type: "keyword",
      keyword: "Bodyguard",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
