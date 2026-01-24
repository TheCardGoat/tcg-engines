import type { CharacterCard } from "@tcg/lorcana-types";

export const basilTenaciousMouse: CharacterCard = {
  id: "l21",
  cardType: "character",
  name: "Basil",
  version: "Tenacious Mouse",
  fullName: "Basil - Tenacious Mouse",
  inkType: ["steel"],
  franchise: "Great Mouse Detective",
  set: "010",
  text: "HOLD YOUR GROUND Whenever you play another Detective character, this character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 2,
  cardNumber: 179,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4bf3f9bd5e3d7bcb4c090ce4252f79077301a240",
  },
  abilities: [
    {
      id: "l21-1",
      type: "triggered",
      name: "HOLD YOUR GROUND",
      trigger: { event: "play", timing: "when", on: "SELF" },
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        target: "SELF",
        value: 1,
      },
      text: "HOLD YOUR GROUND Whenever you play another Detective character, this character gains Resist +1 until the start of your next turn.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Detective"],
};
