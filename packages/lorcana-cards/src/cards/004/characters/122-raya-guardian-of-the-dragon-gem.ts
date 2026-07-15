import type { CharacterCard } from "@tcg/lorcana-types";

export const rayaGuardianOfTheDragonGem: CharacterCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "ready",
          },
          {
            duration: "this-turn",
            restriction: "cant-quest",
            target: "SELF",
            type: "restriction",
          },
        ],
        type: "sequence",
      },
      id: "1n3-1",
      name: "WE HAVE TO COME TOGETHER",
      text: "WE HAVE TO COME TOGETHER When you play this character, ready chosen character of yours at a location. They can't quest for the rest of this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 122,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Princess"],
  cost: 4,
  externalIds: {
    ravensburger: "d4c8f5da2de21bcd1a503c94b73329c9baaf09eb",
  },
  franchise: "Raya and the Last Dragon",
  fullName: "Raya - Guardian of the Dragon Gem",
  id: "1n3",
  inkType: ["ruby"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Raya",
  set: "004",
  strength: 3,
  text: "WE HAVE TO COME TOGETHER When you play this character, ready chosen character of yours at a location. They can't quest for the rest of this turn.",
  version: "Guardian of the Dragon Gem",
  willpower: 3,
};
