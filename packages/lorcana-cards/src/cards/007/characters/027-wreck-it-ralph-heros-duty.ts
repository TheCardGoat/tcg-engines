import type { CharacterCard } from "@tcg/lorcana-types";

export const wreckitRalphHerosDuty: CharacterCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1p2-1",
      name: "OUTFLANK",
      text: "OUTFLANK During your turn, whenever one of your other characters is banished, this character gets +1 {L} this turn.",
      trigger: {
        event: "banish",
        on: "YOUR_OTHER_CHARACTERS",
        timing: "whenever",
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
