import type { CharacterCard } from "@tcg/lorcana-types";

export const queenOfHeartsWonderlandEmpress: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
      id: "1gh-1",
      name: "ALL WAYS HERE ARE MY WAYS",
      text: "ALL WAYS HERE ARE MY WAYS Whenever this character quests, your other Villain characters get +1 {L} this turn.",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 23,
  cardType: "character",
  classifications: ["Dreamborn", "Villain", "Queen"],
  cost: 3,
  externalIds: {
    ravensburger: "bd2e003703e8ab3b1f1f403fc5b4ed14d7335aa1",
  },
  franchise: "Alice in Wonderland",
  fullName: "Queen of Hearts - Wonderland Empress",
  id: "1gh",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Queen of Hearts",
  set: "009",
  strength: 3,
  text: "ALL WAYS HERE ARE MY WAYS Whenever this character quests, your other Villain characters get +1 {L} this turn.",
  version: "Wonderland Empress",
  willpower: 3,
};
