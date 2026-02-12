import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseDetective: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "put-into-inkwell",
          source: "top-of-deck",
          target: "CONTROLLER",
          exerted: true,
          facedown: true,
        },
        type: "optional",
      },
      id: "1wh-1",
      name: "GET A CLUE",
      text: "GET A CLUE When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 160,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Detective"],
  cost: 3,
  externalIds: {
    ravensburger: "f6d5d539a411651374ae418f08e3d379fcb13ff5",
  },
  fullName: "Mickey Mouse - Detective",
  id: "1wh",
  inkType: ["sapphire"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Mickey Mouse",
  set: "010",
  strength: 1,
  text: "GET A CLUE When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.",
  version: "Detective",
  willpower: 3,
};
