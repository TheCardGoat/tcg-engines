import type { CharacterCard } from "@tcg/lorcana-types";

export const annaTruehearted: CharacterCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "lore",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      id: "1qm-1",
      name: "LET ME HELP YOU",
      text: "LET ME HELP YOU Whenever this character quests, your other Hero characters get +1 {L} this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 137,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Queen", "Knight"],
  cost: 4,
  externalIds: {
    ravensburger: "e1b3cea0cee4d2729aad03d87771e607533f1d94",
  },
  franchise: "Frozen",
  fullName: "Anna - True-Hearted",
  id: "1qm",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Anna",
  set: "009",
  strength: 2,
  text: "LET ME HELP YOU Whenever this character quests, your other Hero characters get +1 {L} this turn.",
  version: "True-Hearted",
  willpower: 4,
};
