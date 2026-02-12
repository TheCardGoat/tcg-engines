import type { CharacterCard } from "@tcg/lorcana-types";

export const princePhillipVanquisherOfFoes: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 6,
      },
      id: "1db-1",
      keyword: "Shift",
      text: "Shift 6 {I}",
      type: "keyword",
    },
    {
      id: "1db-2",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "banish",
      },
      id: "1db-3",
      name: "SWIFT AND SURE",
      text: "SWIFT AND SURE When you play this character, banish all opposing damaged characters.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 73,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Prince"],
  cost: 9,
  externalIds: {
    ravensburger: "b1cbda0ae6f55030e3e718582adc878a6ebba693",
  },
  franchise: "Sleeping Beauty",
  fullName: "Prince Phillip - Vanquisher of Foes",
  id: "1db",
  inkType: ["emerald"],
  inkable: true,
  lore: 3,
  missingTests: true,
  name: "Prince Phillip",
  set: "009",
  strength: 6,
  text: "Shift 6 {I} (You may pay 6 {I} to play this on top of one of your characters named Prince Phillip.)\nEvasive (Only characters with Evasive can challenge this character.)\nSWIFT AND SURE When you play this character, banish all opposing damaged characters.",
  version: "Vanquisher of Foes",
  willpower: 6,
};
