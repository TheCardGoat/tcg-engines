import type { CharacterCard } from "@tcg/lorcana-types";

export const wreckitRalphHerosDuty: CharacterCard = {
  id: "1p2",
  cardType: "character",
  name: "Wreck-It Ralph",
  version: "Hero's Duty",
  fullName: "Wreck-It Ralph - Hero's Duty",
  inkType: ["amber"],
  franchise: "Wreck It Ralph",
  set: "007",
  text: "OUTFLANK During your turn, whenever one of your other characters is banished, this character gets +1 {L} this turn.",
  cost: 6,
  strength: 3,
  willpower: 8,
  lore: 1,
  cardNumber: 27,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "dec60147f5f6f17659c25d3d2ec4a24dd5c2d35d",
  },
  abilities: [
    {
      id: "1p2-1",
      type: "triggered",
      name: "OUTFLANK",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "SELF",
        duration: "this-turn",
      },
      text: "OUTFLANK During your turn, whenever one of your other characters is banished, this character gets +1 {L} this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
