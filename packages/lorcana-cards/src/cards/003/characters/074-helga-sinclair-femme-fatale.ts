import type { CharacterCard } from "@tcg/lorcana-types";

export const helgaSinclairFemmeFatale: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "1t9-1",
      keyword: "Shift",
      text: "Shift 3",
      type: "keyword",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 3,
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "deal-damage",
        },
        type: "optional",
      },
      id: "1t9-2",
      name: "THIS CHANGES EVERYTHING",
      text: "THIS CHANGES EVERYTHING Whenever this character quests, you may deal 3 damage to chosen damaged character.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 74,
  cardType: "character",
  classifications: ["Floodborn", "Villain"],
  cost: 5,
  externalIds: {
    ravensburger: "eaf9c3a56b636b27f3a06bfc0f95746b3aefbb0b",
  },
  franchise: "Atlantis",
  fullName: "Helga Sinclair - Femme Fatale",
  id: "1t9",
  inkType: ["emerald"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Helga Sinclair",
  set: "003",
  strength: 4,
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Helga Sinclair.)\nTHIS CHANGES EVERYTHING Whenever this character quests, you may deal 3 damage to chosen damaged character.",
  version: "Femme Fatale",
  willpower: 4,
};
