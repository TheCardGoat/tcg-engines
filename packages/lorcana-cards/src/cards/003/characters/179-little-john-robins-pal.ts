import type { CharacterCard } from "@tcg/lorcana-types";

export const littleJohnRobinsPal: CharacterCard = {
  id: "1ta",
  cardType: "character",
  name: "Little John",
  version: "Robin's Pal",
  fullName: "Little John - Robin's Pal",
  inkType: ["steel"],
  franchise: "Robin Hood",
  set: "003",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nDISGUISED During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 179,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "eb37093fa52ddaa39641f1fb0952282638b7a6d9",
  },
  abilities: [
    {
      id: "1ta-1",
      type: "keyword",
      keyword: "Bodyguard",
      text: "Bodyguard",
    },
    {
      id: "1ta-2",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "SELF",
      },
      text: "DISGUISED During your turn, this character gains Evasive.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
