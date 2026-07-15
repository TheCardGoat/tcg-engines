import type { CharacterCard } from "@tcg/lorcana-types";

export const sneezyNoisyKnight: CharacterCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        keyword: "Challenger",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
        value: 2,
      },
      id: "83h-1",
      name: "HEADWIND",
      text: "HEADWIND When you play this character, chosen Knight character gains Challenger +2 this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 180,
  cardType: "character",
  classifications: ["Dreamborn", "Ally", "Knight", "Seven Dwarfs"],
  cost: 4,
  externalIds: {
    ravensburger: "1d2e270230ea5591f099ec13cd86985cbd578105",
  },
  franchise: "Snow White",
  fullName: "Sneezy - Noisy Knight",
  id: "83h",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Sneezy",
  set: "005",
  strength: 3,
  text: "HEADWIND When you play this character, chosen Knight character gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
  version: "Noisy Knight",
  willpower: 4,
};
