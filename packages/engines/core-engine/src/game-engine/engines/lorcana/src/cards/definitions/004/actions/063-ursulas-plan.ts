import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { exertedSelfCharCantReadyNextTurn } from "@lorcanito/lorcana-engine/effects/effects";

export const ursulasPlan: LorcanaActionCardDefinition = {
  id: "qk9",
  missingTestCase: true,
  name: "Ursula's Plan",
  characteristics: ["action"],
  text: "Each opponent chooses and exerts one of their characters. Those characters can't ready at the start of their next turn.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      text: "Each opponent chooses and exerts one of their characters. Those characters can't ready at the start of their next turn.",
      responder: "opponent",
      effects: [exertedSelfCharCantReadyNextTurn],
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
