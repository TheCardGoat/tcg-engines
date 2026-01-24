import type { CharacterCard } from "@tcg/lorcana-types";

export const rayaHeadstrong: CharacterCard = {
  id: "1jb",
  cardType: "character",
  name: "Raya",
  version: "Headstrong",
  fullName: "Raya - Headstrong",
  inkType: ["ruby"],
  franchise: "Raya and the Last Dragon",
  set: "009",
  text: "NOTE TO SELF, DON'T DIE During your turn, whenever this character banishes another character in a challenge, you may ready this character. If you do, she can't quest for the rest of this turn.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 127,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c75d35692903d3cf6571ffe9cf34ca6854cb779e",
  },
  abilities: [
    {
      id: "1jb-1",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "optional",
            effect: {
              type: "ready",
              target: {
                selector: "self",
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
      text: "NOTE TO SELF, DON'T DIE During your turn, whenever this character banishes another character in a challenge, you may ready this character. If you do, she can't quest for the rest of this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
};
