import type { CharacterCard } from "@tcg/lorcana-types";

export const johnSilverVengefulPirate: CharacterCard = {
  abilities: [
    {
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
      id: "1p4-1",
      text: "DRAWN TO A FIGHT If an opposing character was damaged this turn, you pay 2 {I} less to play this character.",
      type: "action",
    },
    {
      id: "1p4-2",
      keyword: "Resist",
      text: "Resist +1",
      type: "keyword",
      value: 1,
    },
    {
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
      id: "1p4-3",
      name: "I AIN'T GONE SOFT!",
      text: "I AIN'T GONE SOFT! Whenever you play an action that isn't a song, you may deal 1 damage to chosen character.",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "action",
        },
      },
      type: "triggered",
    },
  ],
  cardNumber: 109,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Alien", "Pirate", "Captain"],
  cost: 8,
  externalIds: {
    ravensburger: "dc584065fcb4cd49d186951d0d6d794fd2de71a4",
  },
  franchise: "Treasure Planet",
  fullName: "John Silver - Vengeful Pirate",
  id: "1p4",
  inkType: ["emerald", "steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "John Silver",
  set: "007",
  strength: 6,
  text: "DRAWN TO A FIGHT If an opposing character was damaged this turn, you pay 2 {I} less to play this character.\nResist +1 (Damage dealt to this character is reduced by 1.)\nI AIN'T GONE SOFT! Whenever you play an action that isn't a song, you may deal 1 damage to chosen character.",
  version: "Vengeful Pirate",
  willpower: 4,
};
