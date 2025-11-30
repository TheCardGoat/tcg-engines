import type { CharacterCard } from "@tcg/lorcana";

export const rajahDevotedProtector: CharacterCard = {
  id: "1gk",
  cardType: "character",
  name: "Rajah",
  version: "Devoted Protector",
  fullName: "Rajah - Devoted Protector",
  inkType: ["amber"],
  franchise: "Aladdin",
  set: "010",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  cardNumber: "006",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    ravensburger: "05432111c47bf28eb52d76930eb2c603642d13e9",
  },
  keywords: ["Bodyguard"],
  abilities: [
    {
      id: "1gka1",
      text: "Bodyguard",
      type: "static",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
