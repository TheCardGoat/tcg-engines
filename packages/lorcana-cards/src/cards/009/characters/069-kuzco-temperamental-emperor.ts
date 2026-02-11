import type { CharacterCard } from "@tcg/lorcana-types";

export const kuzcoTemperamentalEmperor: CharacterCard = {
  abilities: [
    {
      id: "1og-1",
      keyword: "Ward",
      text: "Ward",
      type: "keyword",
    },
    {
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
      id: "1og-2",
      name: "NO TOUCHY!",
      text: "NO TOUCHY! When this character is challenged and banished, you may banish the challenging character.",
      trigger: {
        event: "challenged",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 69,
  cardType: "character",
  classifications: ["Storyborn", "King"],
  cost: 5,
  externalIds: {
    ravensburger: "d9db9f6bf253381915cb4e979201f2ce3217677d",
  },
  franchise: "Emperors New Groove",
  fullName: "Kuzco - Temperamental Emperor",
  id: "1og",
  inkType: ["emerald"],
  inkable: false,
  lore: 3,
  missingTests: true,
  name: "Kuzco",
  set: "009",
  strength: 2,
  text: "Ward (Opponents can't choose this character except to challenge.)\nNO TOUCHY! When this character is challenged and banished, you may banish the challenging character.",
  version: "Temperamental Emperor",
  willpower: 4,
};
