import type { CharacterCard } from "@tcg/lorcana-types";

export const kuzcoTemperamentalEmperor: CharacterCard = {
  id: "1og",
  cardType: "character",
  name: "Kuzco",
  version: "Temperamental Emperor",
  fullName: "Kuzco - Temperamental Emperor",
  inkType: ["emerald"],
  franchise: "Emperors New Groove",
  set: "009",
  text: "Ward (Opponents can't choose this character except to challenge.)\nNO TOUCHY! When this character is challenged and banished, you may banish the challenging character.",
  cost: 5,
  strength: 2,
  willpower: 4,
  lore: 3,
  cardNumber: 69,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "d9db9f6bf253381915cb4e979201f2ce3217677d",
  },
  abilities: [
    {
      id: "1og-1",
      type: "keyword",
      keyword: "Ward",
      text: "Ward",
    },
    {
      id: "1og-2",
      type: "triggered",
      name: "NO TOUCHY!",
      trigger: {
        event: "challenged",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
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
        chooser: "CONTROLLER",
      },
      text: "NO TOUCHY! When this character is challenged and banished, you may banish the challenging character.",
    },
  ],
  classifications: ["Storyborn", "King"],
};
