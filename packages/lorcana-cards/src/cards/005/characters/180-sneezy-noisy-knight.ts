import type { CharacterCard } from "@tcg/lorcana-types";

export const sneezyNoisyKnight: CharacterCard = {
  id: "83h",
  cardType: "character",
  name: "Sneezy",
  version: "Noisy Knight",
  fullName: "Sneezy - Noisy Knight",
  inkType: ["steel"],
  franchise: "Snow White",
  set: "005",
  text: "HEADWIND When you play this character, chosen Knight character gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 180,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1d2e270230ea5591f099ec13cd86985cbd578105",
  },
  abilities: [
    {
      id: "83h-1",
      type: "triggered",
      name: "HEADWIND",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        target: "CHOSEN_CHARACTER",
        value: 2,
        duration: "this-turn",
      },
      text: "HEADWIND When you play this character, chosen Knight character gains Challenger +2 this turn.",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Knight", "Seven Dwarfs"],
};
