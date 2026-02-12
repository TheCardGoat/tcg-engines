import type { CharacterCard } from "@tcg/lorcana-types";

export const lefouInstigator: CharacterCard = {
  abilities: [
    {
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
      id: "kll-1",
      name: "FAN THE FLAMES",
      text: "FAN THE FLAMES When you play this character, ready chosen character. They can't quest for the rest of this turn.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 103,
  cardType: "character",
  classifications: ["Dreamborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "4a3e5d428b7702fa462f17ae49962203afeb1ab5",
  },
  franchise: "Beauty and the Beast",
  fullName: "LeFou - Instigator",
  id: "kll",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "LeFou",
  set: "009",
  strength: 2,
  text: "FAN THE FLAMES When you play this character, ready chosen character. They can't quest for the rest of this turn.",
  version: "Instigator",
  willpower: 2,
};
