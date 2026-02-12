import type { CharacterCard } from "@tcg/lorcana-types";

export const merlinCrab: CharacterCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            target: {
              cardTypes: ["character"],
              count: 1,
              owner: "any",
              selector: "self",
              zones: ["play"],
            },
            type: "ready",
          },
          {
            duration: "this-turn",
            keyword: "Challenger",
            target: {
              cardTypes: ["character"],
              count: 1,
              owner: "any",
              selector: "chosen",
              zones: ["play"],
            },
            type: "gain-keyword",
            value: 3,
          },
        ],
        type: "sequence",
      },
      id: "1ih-1",
      name: "READY OR NOT! When you play this character and",
      text: "READY OR NOT! When you play this character and when he leaves play, chosen character gains Challenger +3 this turn.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 50,
  cardType: "character",
  classifications: ["Storyborn", "Mentor", "Sorcerer"],
  cost: 3,
  externalIds: {
    ravensburger: "c432eb95dc74c15e1c3ca51d73030c05e9924344",
  },
  franchise: "Sword in the Stone",
  fullName: "Merlin - Crab",
  id: "1ih",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Merlin",
  set: "002",
  strength: 3,
  text: "READY OR NOT! When you play this character and when he leaves play, chosen character gains Challenger +3 this turn. (They get +3 {S} while challenging.)",
  version: "Crab",
  willpower: 3,
};
