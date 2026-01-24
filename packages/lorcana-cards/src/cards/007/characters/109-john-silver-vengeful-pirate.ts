import type { CharacterCard } from "@tcg/lorcana-types";

export const johnSilverVengefulPirate: CharacterCard = {
  id: "1p4",
  cardType: "character",
  name: "John Silver",
  version: "Vengeful Pirate",
  fullName: "John Silver - Vengeful Pirate",
  inkType: ["emerald", "steel"],
  franchise: "Treasure Planet",
  set: "007",
  text: "DRAWN TO A FIGHT If an opposing character was damaged this turn, you pay 2 {I} less to play this character.\nResist +1 (Damage dealt to this character is reduced by 1.)\nI AIN'T GONE SOFT! Whenever you play an action that isn't a song, you may deal 1 damage to chosen character.",
  cost: 8,
  strength: 6,
  willpower: 4,
  lore: 2,
  cardNumber: 109,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "dc584065fcb4cd49d186951d0d6d794fd2de71a4",
  },
  abilities: [
    {
      id: "1p4-1",
      type: "action",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "an opposing character was damaged this turn",
        },
        then: {
          type: "play-card",
          from: "hand",
        },
      },
      text: "DRAWN TO A FIGHT If an opposing character was damaged this turn, you pay 2 {I} less to play this character.",
    },
    {
      id: "1p4-2",
      type: "keyword",
      keyword: "Resist",
      value: 1,
      text: "Resist +1",
    },
    {
      id: "1p4-3",
      type: "triggered",
      name: "I AIN'T GONE SOFT!",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "action",
        },
      },
      effect: {
        type: "optional",
        effect: {
          type: "deal-damage",
          amount: 1,
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
      text: "I AIN'T GONE SOFT! Whenever you play an action that isn't a song, you may deal 1 damage to chosen character.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Alien", "Pirate", "Captain"],
};
