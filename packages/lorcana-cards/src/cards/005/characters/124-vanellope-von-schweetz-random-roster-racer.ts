import type { CharacterCard } from "@tcg/lorcana-types";

export const vanellopeVonSchweetzRandomRosterRacer: CharacterCard = {
  abilities: [
    {
      id: "a4q-1",
      keyword: "Rush",
      text: "Rush",
      type: "keyword",
    },
    {
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "CHOSEN_CHARACTER",
      },
      id: "a4q-2",
      name: "PIXLEXIA",
      text: "PIXLEXIA When you play this character, she gains Evasive until the start of your next turn.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 124,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Princess", "Racer"],
  cost: 4,
  externalIds: {
    ravensburger: "2483833c1a9722badae219f59fbfceff004e5d39",
  },
  franchise: "Wreck It Ralph",
  fullName: "Vanellope von Schweetz - Random Roster Racer",
  id: "a4q",
  inkType: ["ruby"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Vanellope von Schweetz",
  set: "005",
  strength: 3,
  text: "Rush (This character can challenge the turn they're played.)\nPIXLEXIA When you play this character, she gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)",
  version: "Random Roster Racer",
  willpower: 3,
};
