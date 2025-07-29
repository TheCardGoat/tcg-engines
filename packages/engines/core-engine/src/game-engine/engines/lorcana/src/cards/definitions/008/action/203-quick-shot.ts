import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
import { resolveEffect } from "@lorcanito/lorcana-engine/store/resolvers/effectResolver";

export const quickShot: LorcanaActionCardDefinition = {
  id: "xuh",
  name: "Quick Shot",
  characteristics: ["action"],
  text: "Deal 1 damage to chosen character. Draw a card.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Quick Shot",
      text: "Deal 1 damage to chosen character. Draw a card.",
      resolveEffectsIndividually: true,
      effects: [
        {
          type: "damage",
          amount: 1,
          target: chosenCharacter,
        },
        drawACard,
      ],
    },
  ],
  inkwell: false,
  colors: ["steel"],
  cost: 2,
  illustrator: "Diego Machuca",
  number: 203,
  set: "008",
  rarity: "uncommon",
};
