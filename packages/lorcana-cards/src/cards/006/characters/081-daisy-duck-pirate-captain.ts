import type { CharacterCard } from "@tcg/lorcana";

export const daisyDuckPirateCaptain: CharacterCard = {
  id: "zzu",
  cardType: "character",
  name: "Daisy Duck",
  version: "Pirate Captain",
  fullName: "Daisy Duck - Pirate Captain",
  inkType: ["emerald"],
  set: "006",
  text: "DISTANT SHORES Whenever one of your Pirate characters quests while at a location, draw a card.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 81,
  inkable: true,
  externalIds: {
    ravensburger: "81bb233190edd5db1df45cfb55355201fc429a34",
  },
  abilities: [
    {
      id: "zzu-1",
      text: "DISTANT SHORES Whenever one of your Pirate characters quests while at a location, draw a card.",
      name: "DISTANT SHORES",
      type: "triggered",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
  classifications: ["Dreamborn", "Hero", "Pirate", "Captain"],
};
