import { wheneverPlays } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const drFacilierRemarkable: LorcanaCharacterCardDefinition = {
  id: "xhk",
  name: "Dr. Facilier",
  title: "Remarkable Gentleman",
  characteristics: ["sorcerer", "storyborn", "villain"],
  text: "**DREAMS MADE REAL** Whenever you play a song, you may look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
  type: "character",
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
      optional: true,
      effects: [
        {
          type: "scry",
          amount: 2,
          mode: "both",
          limits: {
            top: 1,
            inkwell: 0,
            bottom: 1,
            hand: 0,
          },
          target: {
            type: "player",
            value: "self",
          },
        },
      ],
    }),
  ],

  inkwell: true,
  colors: ["amethyst"],
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  illustrator: "Cam Kendell",
  number: 39,
  set: "TFC",
  rarity: "rare",
};
