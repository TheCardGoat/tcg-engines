import { wheneverPlays } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const ursulaShellNecklace: LorcanaItemCardDefinition = {
  characteristics: ["item"],
  id: "nba",
  reprints: ["nm0"],
  name: "Ursula's Shell Necklace",
  text: "**NOW, SING!** Whenever you play a song, you may pay 1 {I} to draw a card.",
  type: "item",
  abilities: [
    wheneverPlays({
      triggerTarget: {
        type: "card",
        value: 1,
        filters: [
          { filter: "type", value: "action" },
          { filter: "characteristics", value: ["song"] },
          { filter: "owner", value: "self" },
        ],
      },
      costs: [{ type: "ink", amount: 1 }],
      optional: true,
      effects: [
        {
          type: "draw",
          amount: 1,
          target: {
            type: "player",
            value: "self",
          },
        },
      ],
    }),
  ],
  flavour:
    "Singing is a lovely pastime . . . if you've got the voice for it. −Ursula",
  colors: ["amber"],
  cost: 3,
  illustrator: "Jenna Gray",
  number: 34,
  set: "TFC",
  rarity: "rare",
};
