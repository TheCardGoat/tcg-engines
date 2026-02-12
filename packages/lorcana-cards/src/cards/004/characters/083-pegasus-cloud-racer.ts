import type { CharacterCard } from "@tcg/lorcana-types";

export const pegasusCloudRacer: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "1b8-1",
      keyword: "Shift",
      text: "Shift 3",
      type: "keyword",
    },
    {
      id: "1b8-2",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        condition: {
          expression: "you used Shift to play him",
          type: "if",
        },
        then: {
          keyword: "Evasive",
          target: "YOUR_CHARACTERS",
          type: "gain-keyword",
        },
        type: "conditional",
      },
      id: "1b8-3",
      name: "HOP ON!",
      text: "HOP ON! When you play this character, if you used Shift to play him, your characters gain Evasive until the start of your next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 83,
  cardType: "character",
  classifications: ["Floodborn", "Ally"],
  cost: 5,
  externalIds: {
    ravensburger: "abaaf071fa4ea8b6931182d9e08847f123d363c2",
  },
  franchise: "Hercules",
  fullName: "Pegasus - Cloud Racer",
  id: "1b8",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Pegasus",
  set: "004",
  strength: 3,
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Pegasus.)\nEvasive (Only characters with Evasive can challenge this character.)\nHOP ON! When you play this character, if you used Shift to play him, your characters gain Evasive until the start of your next turn.",
  version: "Cloud Racer",
  willpower: 3,
};
