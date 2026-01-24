import type { CharacterCard } from "@tcg/lorcana-types";

export const merlinCrab: CharacterCard = {
  id: "1ih",
  cardType: "character",
  name: "Merlin",
  version: "Crab",
  fullName: "Merlin - Crab",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "002",
  text: "READY OR NOT! When you play this character and when he leaves play, chosen character gains Challenger +3 this turn. (They get +3 {S} while challenging.)",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 50,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c432eb95dc74c15e1c3ca51d73030c05e9924344",
  },
  abilities: [
    {
      id: "1ih-1",
      type: "triggered",
      name: "READY OR NOT! When you play this character and",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "ready",
            target: {
              selector: "self",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "gain-keyword",
            keyword: "Challenger",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            value: 3,
            duration: "this-turn",
          },
        ],
      },
      text: "READY OR NOT! When you play this character and when he leaves play, chosen character gains Challenger +3 this turn.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "Sorcerer"],
};
