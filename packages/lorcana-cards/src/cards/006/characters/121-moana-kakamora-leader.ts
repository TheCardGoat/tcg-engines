import type { CharacterCard } from "@tcg/lorcana-types";

export const moanaKakamoraLeader: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 5,
      },
      id: "cew-1",
      keyword: "Shift",
      text: "Shift 5",
      type: "keyword",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "gain-lore",
          amount: 1,
        },
        type: "optional",
      },
      id: "cew-2",
      name: "GATHERING FORCES",
      text: "GATHERING FORCES When you play this character, you may move any number of your characters to the same location for free. Gain 1 lore for each character you moved.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 121,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Princess", "Pirate", "Captain"],
  cost: 7,
  externalIds: {
    ravensburger: "2cbd4be598255ef11ca13055090452c77e2f618a",
  },
  franchise: "Moana",
  fullName: "Moana - Kakamora Leader",
  id: "cew",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Moana",
  set: "006",
  strength: 6,
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Moana.)\nGATHERING FORCES When you play this character, you may move any number of your characters to the same location for free. Gain 1 lore for each character you moved.",
  version: "Kakamora Leader",
  willpower: 5,
};
