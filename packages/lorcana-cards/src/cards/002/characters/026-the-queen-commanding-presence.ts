import type { CharacterCard } from "@tcg/lorcana-types";

export const theQueenCommandingPresence: CharacterCard = {
  id: "5hw",
  cardType: "character",
  name: "The Queen",
  version: "Commanding Presence",
  fullName: "The Queen - Commanding Presence",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "002",
  text: "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named The Queen.)\nWHO IS THE FAIREST? Whenever this character quests, chosen opposing character gets -4 {S} this turn and chosen character gets +4 {S} this turn.",
  cost: 5,
  strength: 4,
  willpower: 3,
  lore: 2,
  cardNumber: 26,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "13cfc5ee51d21b9da1620a64f0c80751cd3ffc82",
  },
  abilities: [
    {
      id: "5hw-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 2,
      },
      text: "Shift 2",
    },
    {
      id: "5hw-2",
      type: "triggered",
      name: "WHO IS THE FAIREST?",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-stat",
            stat: "strength",
            modifier: -4,
            target: "SELF",
            duration: "this-turn",
          },
          {
            type: "modify-stat",
            stat: "strength",
            modifier: 4,
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            duration: "this-turn",
          },
        ],
      },
      text: "WHO IS THE FAIREST? Whenever this character quests, chosen opposing character gets -4 {S} this turn and chosen character gets +4 {S} this turn.",
    },
  ],
  classifications: ["Floodborn", "Villain", "Queen"],
};
