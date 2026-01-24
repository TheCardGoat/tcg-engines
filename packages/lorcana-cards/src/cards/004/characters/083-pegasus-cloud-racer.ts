import type { CharacterCard } from "@tcg/lorcana-types";

export const pegasusCloudRacer: CharacterCard = {
  id: "1b8",
  cardType: "character",
  name: "Pegasus",
  version: "Cloud Racer",
  fullName: "Pegasus - Cloud Racer",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "004",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Pegasus.)\nEvasive (Only characters with Evasive can challenge this character.)\nHOP ON! When you play this character, if you used Shift to play him, your characters gain Evasive until the start of your next turn.",
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 83,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "abaaf071fa4ea8b6931182d9e08847f123d363c2",
  },
  abilities: [
    {
      id: "1b8-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
      text: "Shift 3",
    },
    {
      id: "1b8-2",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "1b8-3",
      type: "triggered",
      name: "HOP ON!",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you used Shift to play him",
        },
        then: {
          type: "gain-keyword",
          keyword: "Evasive",
          target: "YOUR_CHARACTERS",
        },
      },
      text: "HOP ON! When you play this character, if you used Shift to play him, your characters gain Evasive until the start of your next turn.",
    },
  ],
  classifications: ["Floodborn", "Ally"],
};
