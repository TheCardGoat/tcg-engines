import type { CharacterCard } from "@tcg/lorcana-types";

export const wreckitRalphHerosDuty: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "SELF",
        duration: "this-turn",
      },
      id: "1p2-1",
      name: "OUTFLANK",
      text: "OUTFLANK During your turn, whenever one of your other characters is banished, this character gets +1 {L} this turn.",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      type: "triggered",
    },
  ],
  cardNumber: 27,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 6,
  externalIds: {
    ravensburger: "dec60147f5f6f17659c25d3d2ec4a24dd5c2d35d",
  },
  franchise: "Wreck It Ralph",
  fullName: "Wreck-It Ralph - Hero's Duty",
  id: "1p2",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Wreck-It Ralph",
  set: "007",
  strength: 3,
  text: "OUTFLANK During your turn, whenever one of your other characters is banished, this character gets +1 {L} this turn.",
  version: "Hero's Duty",
  willpower: 8,
};
