import type { CharacterCard } from "@tcg/lorcana";

export const naniProtectiveSister: CharacterCard = {
  id: "1fn",
  cardType: "character",
  name: "Nani",
  version: "Protective Sister",
  fullName: "Nani - Protective Sister",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "009",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 2,
  cardNumber: 17,
  inkable: true,
  externalIds: {
    ravensburger: "ba2f05538e1999601db469cfe0b44f78bcbdb61c",
  },
  keywords: ["Bodyguard"],
  abilities: [
    {
      id: "1fn-1",
      text: "Bodyguard",
      type: "keyword",
      keyword: "Bodyguard",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
