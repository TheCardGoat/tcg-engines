import type { CharacterCard } from "@tcg/lorcana-types";

export const wreckitRalphDemolitionDude: CharacterCard = {
  abilities: [
    {
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      id: "co0-1",
      name: "REFRESHING BREAK",
      text: "REFRESHING BREAK Whenever you ready this character, gain 1 lore for each 1 damage on him.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 104,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 3,
  externalIds: {
    ravensburger: "2da73ef591ab60b75c73c4ba1a17446a87ea8fea",
  },
  franchise: "Wreck It Ralph",
  fullName: "Wreck-It Ralph - Demolition Dude",
  id: "co0",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Wreck-It Ralph",
  set: "005",
  strength: 1,
  text: "REFRESHING BREAK Whenever you ready this character, gain 1 lore for each 1 damage on him.",
  version: "Demolition Dude",
  willpower: 4,
};
