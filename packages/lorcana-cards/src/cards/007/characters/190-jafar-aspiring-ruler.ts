import type { CharacterCard } from "@tcg/lorcana-types";

export const jafarAspiringRuler: CharacterCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        keyword: "Challenger",
        target: "SELF",
        type: "gain-keyword",
        value: 2,
      },
      id: "1bu-1",
      name: "THAT'S BETTER",
      text: "THAT'S BETTER When you play this character, chosen character gains Challenger +2 this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 190,
  cardType: "character",
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
  cost: 3,
  externalIds: {
    ravensburger: "ac6a2901f00291b5613e65f0a4c17baf9607964c",
  },
  franchise: "Aladdin",
  fullName: "Jafar - Aspiring Ruler",
  id: "1bu",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Jafar",
  set: "007",
  strength: 3,
  text: "THAT'S BETTER When you play this character, chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
  version: "Aspiring Ruler",
  willpower: 2,
};
