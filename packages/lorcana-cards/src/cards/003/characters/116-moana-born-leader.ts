import type { CharacterCard } from "@tcg/lorcana-types";

export const moanaBornLeader: CharacterCard = {
  id: "cku",
  cardType: "character",
  name: "Moana",
  version: "Born Leader",
  fullName: "Moana - Born Leader",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "003",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Moana.)\nWELCOME TO MY BOAT Whenever this character quests while at a location, ready all other characters here. They can't quest for the rest of this turn.",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  cardNumber: 116,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2d55f3560e49972216272b91e7a9f71ad3897554",
  },
  abilities: [
    {
      id: "cku-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
      text: "Shift 3",
    },
    {
      id: "cku-2",
      type: "triggered",
      name: "WELCOME TO MY BOAT",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "ready",
            target: {
              selector: "all",
              count: "all",
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
      text: "WELCOME TO MY BOAT Whenever this character quests while at a location, ready all other characters here. They can't quest for the rest of this turn.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Princess", "Captain"],
};
