import type { CharacterCard } from "@tcg/lorcana";

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
  cardNumber: "188",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 2,
  inkable: true,
  vanilla: false,
  externalIds: {
    ravensburger: "0669c45afa1ed8a75915fc48406f8c1f601cc2db",
  },
  keywords: ["Bodyguard"],
  abilities: [
    {
      id: "1s2-ability-1",
      text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
      type: "static",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
