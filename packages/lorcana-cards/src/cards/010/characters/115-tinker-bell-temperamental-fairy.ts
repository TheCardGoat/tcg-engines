import type { CharacterCard } from "@tcg/lorcana-types";

export const tinkerBellTemperamentalFairy: CharacterCard = {
  id: "yus",
  cardType: "character",
  name: "Tinker Bell",
  version: "Temperamental Fairy",
  fullName: "Tinker Bell - Temperamental Fairy",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "010",
  text: "Shift 3 {I} (You may pay 3 {I} to play this on top of one of your characters named Tinker Bell.)\nHARMLESS DIVERSION When you play this character, exert chosen opposing character with 2 {S} or less.",
  cost: 5,
  strength: 5,
  willpower: 3,
  lore: 1,
  cardNumber: 115,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7d9ec2509c9bb4c8d087b0bc58d9209bbd9ff4b3",
  },
  abilities: [
    {
      id: "yus-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
      text: "Shift 3 {I}",
    },
    {
      id: "yus-2",
      type: "triggered",
      name: "HARMLESS DIVERSION",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "exert",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "HARMLESS DIVERSION When you play this character, exert chosen opposing character with 2 {S} or less.",
    },
  ],
  classifications: ["Floodborn", "Ally", "Fairy"],
};
