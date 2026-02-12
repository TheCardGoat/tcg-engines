import type { CharacterCard } from "@tcg/lorcana-types";

export const royalGuardOctopusSoldier: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        target: "SELF",
        value: 1,
        duration: "this-turn",
      },
      id: "9mz-1",
      name: "HEAVILY ARMED",
      text: "HEAVILY ARMED Whenever you draw a card, this character gains Challenger +1 this turn.",
      trigger: { event: "play", timing: "when", on: "SELF" },
      type: "triggered",
    },
  ],
  cardNumber: 52,
  cardType: "character",
  classifications: ["Storyborn"],
  cost: 1,
  externalIds: {
    ravensburger: "22bcaf985cf7458b8c12396023a332712fd7f998",
  },
  franchise: "Emperors New Groove",
  fullName: "Royal Guard - Octopus Soldier",
  id: "9mz",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Royal Guard",
  set: "008",
  strength: 1,
  text: "HEAVILY ARMED Whenever you draw a card, this character gains Challenger +1 this turn. (They get +1 {S} while challenging.)",
  version: "Octopus Soldier",
  willpower: 2,
};
