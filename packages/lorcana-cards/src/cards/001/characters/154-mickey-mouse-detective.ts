import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMousedetective: CharacterCard = {
  id: "aec",
  cardType: "character",
  name: "Mickey Mouse",
  version: "Detective",
  fullName: "Mickey Mouse - Detective",
  inkType: ["sapphire"],
  franchise: "Disney",
  set: "001",
  text: "**GET A CLUE** When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 154,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**GET A CLUE** When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.",
      id: "aec-1",
      effect: {
        type: "optional",
        effect: {
          type: "put-into-inkwell",
          source: "top-of-deck",
          target: "CONTROLLER",
          exerted: true,
          facedown: true,
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Hero", "Dreamborn", "Detective"],
};
