import type { CharacterCard } from "@tcg/lorcana-types";

export const vanellopeVonSchweetzRandomRosterRacer: CharacterCard = {
  id: "a4q",
  cardType: "character",
  name: "Vanellope von Schweetz",
  version: "Random Roster Racer",
  fullName: "Vanellope von Schweetz - Random Roster Racer",
  inkType: ["ruby"],
  franchise: "Wreck It Ralph",
  set: "005",
  text: "Rush (This character can challenge the turn they're played.)\nPIXLEXIA When you play this character, she gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 124,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "2483833c1a9722badae219f59fbfceff004e5d39",
  },
  abilities: [
    {
      id: "a4q-1",
      type: "keyword",
      keyword: "Rush",
      text: "Rush",
    },
    {
      id: "a4q-2",
      type: "triggered",
      name: "PIXLEXIA",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "CHOSEN_CHARACTER",
      },
      text: "PIXLEXIA When you play this character, she gains Evasive until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess", "Racer"],
};
