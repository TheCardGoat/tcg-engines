import type { CharacterCard } from "@tcg/lorcana-types";

export const wreckitRalphDemolitionDude: CharacterCard = {
  id: "co0",
  cardType: "character",
  name: "Wreck-It Ralph",
  version: "Demolition Dude",
  fullName: "Wreck-It Ralph - Demolition Dude",
  inkType: ["ruby"],
  franchise: "Wreck It Ralph",
  set: "005",
  text: "REFRESHING BREAK Whenever you ready this character, gain 1 lore for each 1 damage on him.",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 1,
  cardNumber: 104,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2da73ef591ab60b75c73c4ba1a17446a87ea8fea",
  },
  abilities: [
    {
      id: "co0-1",
      type: "triggered",
      name: "REFRESHING BREAK",
      trigger: { event: "play", timing: "when", on: "SELF" },
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      text: "REFRESHING BREAK Whenever you ready this character, gain 1 lore for each 1 damage on him.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
