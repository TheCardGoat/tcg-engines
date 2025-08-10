import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const ursulasPlan: LorcanaActionCardDefinition = {
  id: "qk9",
  missingTestCase: true,
  name: "Ursula's Plan",
  characteristics: ["action"],
  text: "Each opponent chooses and exerts one of their characters. Those characters can't ready at the start of their next turn.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Each opponent chooses and exerts one of their characters. Those characters can't ready at the start of their next turn.",
      effects: [],
    },
  ],
  flavour:
    "With both the crown and the trident, together we would be unstoppable!",
  colors: ["amethyst"],
  cost: 3,
  illustrator: "Eri Welli",
  number: 63,
  set: "URR",
  rarity: "uncommon",
};
