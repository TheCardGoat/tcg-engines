import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMousePirateCaptain: CharacterCard = {
  id: "adf",
  cardType: "character",
  name: "Mickey Mouse",
  version: "Pirate Captain",
  fullName: "Mickey Mouse - Pirate Captain",
  inkType: ["ruby"],
  set: "006",
  text: 'Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Mickey Mouse.)\nMARINER’S MIGHT Whenever this character quests, chosen Pirate character gets +2 {S} and gains "This character takes no damage from challenges" this turn.',
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  cardNumber: 103,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "25626315d5e1fbf223d3c10f20336b464a7a2e7e",
  },
  abilities: [
    {
      id: "adf-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
      text: "Shift 3",
    },
    {
      id: "adf-2",
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
        duration: "this-turn",
      },
      text: 'MARINER’S MIGHT Whenever this character quests, chosen Pirate character gets +2 {S} and gains "This character takes no damage from challenges" this turn.',
    },
  ],
  classifications: ["Floodborn", "Hero", "Pirate", "Captain"],
};
