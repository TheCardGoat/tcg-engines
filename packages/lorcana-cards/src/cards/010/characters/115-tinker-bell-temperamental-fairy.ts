import type { CharacterCard } from "@tcg/lorcana-types";

export const tinkerBellTemperamentalFairy: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "yus-1",
      keyword: "Shift",
      text: "Shift 3 {I}",
      type: "keyword",
    },
    {
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
      id: "yus-2",
      name: "HARMLESS DIVERSION",
      text: "HARMLESS DIVERSION When you play this character, exert chosen opposing character with 2 {S} or less.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 115,
  cardType: "character",
  classifications: ["Floodborn", "Ally", "Fairy"],
  cost: 5,
  externalIds: {
    ravensburger: "7d9ec2509c9bb4c8d087b0bc58d9209bbd9ff4b3",
  },
  franchise: "Peter Pan",
  fullName: "Tinker Bell - Temperamental Fairy",
  id: "yus",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Tinker Bell",
  set: "010",
  strength: 5,
  text: "Shift 3 {I} (You may pay 3 {I} to play this on top of one of your characters named Tinker Bell.)\nHARMLESS DIVERSION When you play this character, exert chosen opposing character with 2 {S} or less.",
  version: "Temperamental Fairy",
  willpower: 3,
};
