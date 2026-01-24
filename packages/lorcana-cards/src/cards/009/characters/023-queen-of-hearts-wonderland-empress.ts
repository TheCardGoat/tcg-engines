import type { CharacterCard } from "@tcg/lorcana-types";

export const queenOfHeartsWonderlandEmpress: CharacterCard = {
  id: "1gh",
  cardType: "character",
  name: "Queen of Hearts",
  version: "Wonderland Empress",
  fullName: "Queen of Hearts - Wonderland Empress",
  inkType: ["amber"],
  franchise: "Alice in Wonderland",
  set: "009",
  text: "ALL WAYS HERE ARE MY WAYS Whenever this character quests, your other Villain characters get +1 {L} this turn.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 23,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "bd2e003703e8ab3b1f1f403fc5b4ed14d7335aa1",
  },
  abilities: [
    {
      id: "1gh-1",
      type: "triggered",
      name: "ALL WAYS HERE ARE MY WAYS",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
      text: "ALL WAYS HERE ARE MY WAYS Whenever this character quests, your other Villain characters get +1 {L} this turn.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Queen"],
};
