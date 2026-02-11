import type { CharacterCard } from "@tcg/lorcana-types";

export const fairyGodmotherPureHeart: CharacterCard = {
  abilities: [
    {
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
      id: "109-1",
      name: "JUST LEAVE IT TO ME",
      text: "JUST LEAVE IT TO ME Whenever you play a character named Cinderella, you may exert chosen character.",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "character",
        },
      },
      type: "triggered",
    },
  ],
  cardNumber: 42,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Fairy"],
  cost: 3,
  externalIds: {
    ravensburger: "83b99c29716dc645e59792cecd067f6715bc51fd",
  },
  franchise: "Cinderella",
  fullName: "Fairy Godmother - Pure Heart",
  id: "109",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Fairy Godmother",
  set: "002",
  strength: 3,
  text: "JUST LEAVE IT TO ME Whenever you play a character named Cinderella, you may exert chosen character.",
  version: "Pure Heart",
  willpower: 4,
};
