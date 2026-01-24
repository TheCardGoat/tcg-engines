import type { CharacterCard } from "@tcg/lorcana-types";

export const dellaDuckReturningMother: CharacterCard = {
  id: "27n",
  cardType: "character",
  name: "Della Duck",
  version: "Returning Mother",
  fullName: "Della Duck - Returning Mother",
  inkType: ["amber"],
  franchise: "Ducktales",
  set: "010",
  text: "HERE TO HELP When you play this character, you may ready chosen character with Boost. If you do, they can't quest or challenge for the rest of this turn.",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 2,
  cardNumber: 22,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "0038b4628fb52601c11e7c7feca10740c56f09d8",
  },
  abilities: [
    {
      id: "27n-1",
      type: "triggered",
      name: "HERE TO HELP",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "optional",
            effect: {
              type: "ready",
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
          {
            type: "restriction",
            restriction: "cant-quest",
            target: "SELF",
            duration: "this-turn",
          },
        ],
      },
      text: "HERE TO HELP When you play this character, you may ready chosen character with Boost. If you do, they can't quest or challenge for the rest of this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
