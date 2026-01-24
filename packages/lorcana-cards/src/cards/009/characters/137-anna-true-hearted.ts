import type { CharacterCard } from "@tcg/lorcana-types";

export const annaTruehearted: CharacterCard = {
  id: "1qm",
  cardType: "character",
  name: "Anna",
  version: "True-Hearted",
  fullName: "Anna - True-Hearted",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "009",
  text: "LET ME HELP YOU Whenever this character quests, your other Hero characters get +1 {L} this turn.",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  cardNumber: 137,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e1b3cea0cee4d2729aad03d87771e607533f1d94",
  },
  abilities: [
    {
      id: "1qm-1",
      type: "triggered",
      name: "LET ME HELP YOU",
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
      text: "LET ME HELP YOU Whenever this character quests, your other Hero characters get +1 {L} this turn.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Queen", "Knight"],
};
