import type { CharacterCard } from "@tcg/lorcana-types";

export const helgaSinclairFemmeFatale: CharacterCard = {
  id: "1t9",
  cardType: "character",
  name: "Helga Sinclair",
  version: "Femme Fatale",
  fullName: "Helga Sinclair - Femme Fatale",
  inkType: ["emerald"],
  franchise: "Atlantis",
  set: "003",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Helga Sinclair.)\nTHIS CHANGES EVERYTHING Whenever this character quests, you may deal 3 damage to chosen damaged character.",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  cardNumber: 74,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "eaf9c3a56b636b27f3a06bfc0f95746b3aefbb0b",
  },
  abilities: [
    {
      id: "1t9-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
      text: "Shift 3",
    },
    {
      id: "1t9-2",
      type: "triggered",
      name: "THIS CHANGES EVERYTHING",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "deal-damage",
          amount: 3,
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
      text: "THIS CHANGES EVERYTHING Whenever this character quests, you may deal 3 damage to chosen damaged character.",
    },
  ],
  classifications: ["Floodborn", "Villain"],
};
