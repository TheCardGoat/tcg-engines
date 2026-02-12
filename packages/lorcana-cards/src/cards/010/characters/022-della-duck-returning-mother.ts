import type { CharacterCard } from "@tcg/lorcana-types";

export const dellaDuckReturningMother: CharacterCard = {
  abilities: [
    {
      effect: {
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
        type: "sequence",
      },
      id: "27n-1",
      name: "HERE TO HELP",
      text: "HERE TO HELP When you play this character, you may ready chosen character with Boost. If you do, they can't quest or challenge for the rest of this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 22,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "0038b4628fb52601c11e7c7feca10740c56f09d8",
  },
  franchise: "Ducktales",
  fullName: "Della Duck - Returning Mother",
  id: "27n",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Della Duck",
  set: "010",
  strength: 2,
  text: "HERE TO HELP When you play this character, you may ready chosen character with Boost. If you do, they can't quest or challenge for the rest of this turn.",
  version: "Returning Mother",
  willpower: 5,
};
