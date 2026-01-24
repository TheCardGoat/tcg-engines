import type { CharacterCard } from "@tcg/lorcana-types";

export const moanaKakamoraLeader: CharacterCard = {
  id: "cew",
  cardType: "character",
  name: "Moana",
  version: "Kakamora Leader",
  fullName: "Moana - Kakamora Leader",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "006",
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Moana.)\nGATHERING FORCES When you play this character, you may move any number of your characters to the same location for free. Gain 1 lore for each character you moved.",
  cost: 7,
  strength: 6,
  willpower: 5,
  lore: 1,
  cardNumber: 121,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2cbd4be598255ef11ca13055090452c77e2f618a",
  },
  abilities: [
    {
      id: "cew-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 5,
      },
      text: "Shift 5",
    },
    {
      id: "cew-2",
      type: "triggered",
      name: "GATHERING FORCES",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "gain-lore",
          amount: 1,
        },
        chooser: "CONTROLLER",
      },
      text: "GATHERING FORCES When you play this character, you may move any number of your characters to the same location for free. Gain 1 lore for each character you moved.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Princess", "Pirate", "Captain"],
};
