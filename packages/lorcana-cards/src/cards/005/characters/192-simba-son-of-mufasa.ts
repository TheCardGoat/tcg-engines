import type { CharacterCard } from "@tcg/lorcana-types";

export const simbaSonOfMufasa: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 4,
      },
      id: "xnq-1",
      keyword: "Shift",
      text: "Shift 4",
      type: "keyword",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            cardTypes: ["item"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "banish",
        },
        type: "optional",
      },
      id: "xnq-2",
      name: "FEARSOME ROAR",
      text: "FEARSOME ROAR When you play this character, you may banish chosen item or location.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 192,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "King"],
  cost: 6,
  externalIds: {
    ravensburger: "794f84fd2ebc3cb03afad4d4a6a7dc5cf90a4cd5",
  },
  franchise: "Lion King",
  fullName: "Simba - Son of Mufasa",
  id: "xnq",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Simba",
  set: "005",
  strength: 3,
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Simba.)\nFEARSOME ROAR When you play this character, you may banish chosen item or location.",
  version: "Son of Mufasa",
  willpower: 5,
};
