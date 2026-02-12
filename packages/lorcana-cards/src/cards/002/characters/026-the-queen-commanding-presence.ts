import type { CharacterCard } from "@tcg/lorcana-types";

export const theQueenCommandingPresence: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 2,
      },
      id: "5hw-1",
      keyword: "Shift",
      text: "Shift 2",
      type: "keyword",
    },
    {
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
      id: "5hw-2",
      name: "WHO IS THE FAIREST?",
      text: "WHO IS THE FAIREST? Whenever this character quests, chosen opposing character gets -4 {S} this turn and chosen character gets +4 {S} this turn.",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 26,
  cardType: "character",
  classifications: ["Floodborn", "Villain", "Queen"],
  cost: 5,
  externalIds: {
    ravensburger: "13cfc5ee51d21b9da1620a64f0c80751cd3ffc82",
  },
  franchise: "Snow White",
  fullName: "The Queen - Commanding Presence",
  id: "5hw",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "The Queen",
  set: "002",
  strength: 4,
  text: "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named The Queen.)\nWHO IS THE FAIREST? Whenever this character quests, chosen opposing character gets -4 {S} this turn and chosen character gets +4 {S} this turn.",
  version: "Commanding Presence",
  willpower: 3,
};
