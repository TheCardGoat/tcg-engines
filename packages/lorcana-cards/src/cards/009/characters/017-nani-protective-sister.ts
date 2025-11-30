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
  cardNumber: "017",
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 2,
  inkable: true,
  vanilla: false,
  externalIds: {
    ravensburger: "ba2f05538e1999601db469cfe0b44f78bcbdb61c",
  },
  keywords: ["Bodyguard"],
  abilities: [
    {
      id: "1fn-ability-1",
      text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
      type: "static",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
