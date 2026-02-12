import type { CharacterCard } from "@tcg/lorcana-types";

export const moanaBornLeader: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "cku-1",
      keyword: "Shift",
      text: "Shift 3",
      type: "keyword",
    },
    {
      effect: {
        steps: [
          {
            target: {
              cardTypes: ["character"],
              count: "all",
              owner: "any",
              selector: "all",
              zones: ["play"],
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
      id: "cku-2",
      name: "WELCOME TO MY BOAT",
      text: "WELCOME TO MY BOAT Whenever this character quests while at a location, ready all other characters here. They can't quest for the rest of this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 116,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Princess", "Captain"],
  cost: 5,
  externalIds: {
    ravensburger: "2d55f3560e49972216272b91e7a9f71ad3897554",
  },
  franchise: "Moana",
  fullName: "Moana - Born Leader",
  id: "cku",
  inkType: ["ruby"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Moana",
  set: "003",
  strength: 4,
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Moana.)\nWELCOME TO MY BOAT Whenever this character quests while at a location, ready all other characters here. They can't quest for the rest of this turn.",
  version: "Born Leader",
  willpower: 4,
};
