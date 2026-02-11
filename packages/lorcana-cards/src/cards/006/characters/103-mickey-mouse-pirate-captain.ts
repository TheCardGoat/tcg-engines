import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMousePirateCaptain: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "adf-1",
      keyword: "Shift",
      text: "Shift 3",
      type: "keyword",
    },
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
        duration: "this-turn",
      },
      id: "adf-2",
      text: 'MARINER’S MIGHT Whenever this character quests, chosen Pirate character gets +2 {S} and gains "This character takes no damage from challenges" this turn.',
      type: "action",
    },
  ],
  cardNumber: 103,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Pirate", "Captain"],
  cost: 5,
  externalIds: {
    ravensburger: "25626315d5e1fbf223d3c10f20336b464a7a2e7e",
  },
  fullName: "Mickey Mouse - Pirate Captain",
  id: "adf",
  inkType: ["ruby"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Mickey Mouse",
  set: "006",
  strength: 4,
  text: 'Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Mickey Mouse.)\nMARINER’S MIGHT Whenever this character quests, chosen Pirate character gets +2 {S} and gains "This character takes no damage from challenges" this turn.',
  version: "Pirate Captain",
  willpower: 4,
};
