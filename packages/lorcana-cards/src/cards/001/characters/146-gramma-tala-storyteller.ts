import type { CharacterCard } from "@tcg/lorcana-types";

export const GrammaTalaStoryteller: CharacterCard = {
  id: "n00",
  cardType: "character",
  name: "Gramma Tala",
  version: "Storyteller",
  fullName: "Gramma Tala - Storyteller",
  inkType: ["sapphire"],
  franchise: "Disney",
  set: "001",
  text: "**I WILL BE WITH YOU** When this character is banished, you may put this card into your inkwell facedown and exerted.",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
  cardNumber: 146,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**I WILL BE WITH YOU** When this character is banished, you may put this card into your inkwell facedown and exerted.",
      id: "n00-1",
      effect: {
        type: "optional",
        effect: {
          type: "put-into-inkwell",
          source: "this-card",
          target: "CONTROLLER",
          exerted: true,
          facedown: true,
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Storyborn", "Mentor"],
};
