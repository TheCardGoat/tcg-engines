import type { CharacterCard } from "@tcg/lorcana-types";

export const webbyVanderquackKnowledgeSeeker: CharacterCard = {
  abilities: [
    {
      effect: {
        modifier: 1,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "15d-1",
      text: "I'VE READ ABOUT THIS While you have a character or location in play with a card under them, this character gets +1 {L}.",
      type: "action",
    },
  ],
  cardNumber: 9,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "95238358d3a1be4da06bd9f8c1940dc4276806a6",
  },
  franchise: "Ducktales",
  fullName: "Webby Vanderquack - Knowledge Seeker",
  id: "15d",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Webby Vanderquack",
  set: "010",
  strength: 1,
  text: "I'VE READ ABOUT THIS While you have a character or location in play with a card under them, this character gets +1 {L}.",
  version: "Knowledge Seeker",
  willpower: 6,
};
