import type { CharacterCard } from "@tcg/lorcana-types";

export const princePhillipVanquisherOfFoes: CharacterCard = {
  id: "1db",
  cardType: "character",
  name: "Prince Phillip",
  version: "Vanquisher of Foes",
  fullName: "Prince Phillip - Vanquisher of Foes",
  inkType: ["emerald"],
  franchise: "Sleeping Beauty",
  set: "009",
  text: "Shift 6 {I} (You may pay 6 {I} to play this on top of one of your characters named Prince Phillip.)\nEvasive (Only characters with Evasive can challenge this character.)\nSWIFT AND SURE When you play this character, banish all opposing damaged characters.",
  cost: 9,
  strength: 6,
  willpower: 6,
  lore: 3,
  cardNumber: 73,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b1cbda0ae6f55030e3e718582adc878a6ebba693",
  },
  abilities: [
    {
      id: "1db-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 6,
      },
      text: "Shift 6 {I}",
    },
    {
      id: "1db-2",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "1db-3",
      type: "triggered",
      name: "SWIFT AND SURE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "banish",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "SWIFT AND SURE When you play this character, banish all opposing damaged characters.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Prince"],
};
