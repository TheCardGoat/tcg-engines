import type { CharacterCard } from "@tcg/lorcana-types";

export const lefouInstigator: CharacterCard = {
  id: "kll",
  cardType: "character",
  name: "LeFou",
  version: "Instigator",
  fullName: "LeFou - Instigator",
  inkType: ["ruby"],
  franchise: "Beauty and the Beast",
  set: "009",
  text: "FAN THE FLAMES When you play this character, ready chosen character. They can't quest for the rest of this turn.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 103,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4a3e5d428b7702fa462f17ae49962203afeb1ab5",
  },
  abilities: [
    {
      id: "kll-1",
      type: "triggered",
      name: "FAN THE FLAMES",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "ready",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "restriction",
            restriction: "cant-quest",
            target: "SELF",
            duration: "this-turn",
          },
        ],
      },
      text: "FAN THE FLAMES When you play this character, ready chosen character. They can't quest for the rest of this turn.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
};
