import type { CharacterCard } from "@tcg/lorcana-types";

export const littleJohnRobinsPal: CharacterCard = {
  abilities: [
    {
      id: "1ta-1",
      keyword: "Bodyguard",
      text: "Bodyguard",
      type: "keyword",
    },
    {
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "SELF",
      },
      id: "1ta-2",
      text: "DISGUISED During your turn, this character gains Evasive.",
      type: "action",
    },
  ],
  cardNumber: 179,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "eb37093fa52ddaa39641f1fb0952282638b7a6d9",
  },
  franchise: "Robin Hood",
  fullName: "Little John - Robin's Pal",
  id: "1ta",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Little John",
  set: "003",
  strength: 2,
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nDISGUISED During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
  version: "Robin's Pal",
  willpower: 4,
};
