import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseDetective: CharacterCard = {
  id: "1wh",
  cardType: "character",
  name: "Mickey Mouse",
  version: "Detective",
  fullName: "Mickey Mouse - Detective",
  inkType: ["sapphire"],
  set: "010",
  text: "GET A CLUE When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 160,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "f6d5d539a411651374ae418f08e3d379fcb13ff5",
  },
  abilities: [
    {
      id: "1wh-1",
      type: "triggered",
      name: "GET A CLUE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
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
      text: "GET A CLUE When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Detective"],
};
