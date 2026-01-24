import type { CharacterCard } from "@tcg/lorcana-types";

export const fairyGodmotherPureHeart: CharacterCard = {
  id: "109",
  cardType: "character",
  name: "Fairy Godmother",
  version: "Pure Heart",
  fullName: "Fairy Godmother - Pure Heart",
  inkType: ["amethyst"],
  franchise: "Cinderella",
  set: "002",
  text: "JUST LEAVE IT TO ME Whenever you play a character named Cinderella, you may exert chosen character.",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 42,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "83b99c29716dc645e59792cecd067f6715bc51fd",
  },
  abilities: [
    {
      id: "109-1",
      type: "triggered",
      name: "JUST LEAVE IT TO ME",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "character",
        },
      },
      effect: {
        type: "optional",
        effect: {
          type: "exert",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "JUST LEAVE IT TO ME Whenever you play a character named Cinderella, you may exert chosen character.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Fairy"],
};
