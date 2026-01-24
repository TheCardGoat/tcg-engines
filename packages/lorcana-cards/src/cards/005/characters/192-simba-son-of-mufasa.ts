import type { CharacterCard } from "@tcg/lorcana-types";

export const simbaSonOfMufasa: CharacterCard = {
  id: "xnq",
  cardType: "character",
  name: "Simba",
  version: "Son of Mufasa",
  fullName: "Simba - Son of Mufasa",
  inkType: ["steel"],
  franchise: "Lion King",
  set: "005",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Simba.)\nFEARSOME ROAR When you play this character, you may banish chosen item or location.",
  cost: 6,
  strength: 3,
  willpower: 5,
  lore: 1,
  cardNumber: 192,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "794f84fd2ebc3cb03afad4d4a6a7dc5cf90a4cd5",
  },
  abilities: [
    {
      id: "xnq-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
      text: "Shift 4",
    },
    {
      id: "xnq-2",
      type: "triggered",
      name: "FEARSOME ROAR",
      trigger: {
        event: "play",
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
            cardTypes: ["item"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "FEARSOME ROAR When you play this character, you may banish chosen item or location.",
    },
  ],
  classifications: ["Floodborn", "Hero", "King"],
};
