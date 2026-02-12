import type { CharacterCard } from "@tcg/lorcana-types";

export const basilTenaciousMouse: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        target: "SELF",
        value: 1,
      },
      id: "l21-1",
      name: "HOLD YOUR GROUND",
      text: "HOLD YOUR GROUND Whenever you play another Detective character, this character gains Resist +1 until the start of your next turn.",
      trigger: { event: "play", timing: "when", on: "SELF" },
      type: "triggered",
    },
  ],
  cardNumber: 179,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Detective"],
  cost: 3,
  externalIds: {
    ravensburger: "4bf3f9bd5e3d7bcb4c090ce4252f79077301a240",
  },
  franchise: "Great Mouse Detective",
  fullName: "Basil - Tenacious Mouse",
  id: "l21",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Basil",
  set: "010",
  strength: 3,
  text: "HOLD YOUR GROUND Whenever you play another Detective character, this character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
  version: "Tenacious Mouse",
  willpower: 2,
};
