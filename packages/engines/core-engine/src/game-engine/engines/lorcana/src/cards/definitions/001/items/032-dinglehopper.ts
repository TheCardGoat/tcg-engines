import type { ActivatedAbility } from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const dingleHopper: LorcanaItemCardDefinition = {
  characteristics: ["item"],
  id: "qef",
  name: "Dinglehopper",
  text: "**STRAIGHTEN HAIR** {E} - Remove up to 1 damage from chosen character.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "Straighten Hair",
      text: "{E} - Remove up to 1 damage from chosen character.",
      optional: false,
      costs: [{ type: "exert" }],
      effects: [
        {
          type: "heal",
          amount: 1,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "owner", value: "self" },
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
            ],
          },
        },
      ],
    } as ActivatedAbility,
  ],
  flavour: "Enjoy the finest of human hairstyles.",
  inkwell: true,
  colors: ["amber"],
  cost: 1,
  illustrator: "Eri Welli",
  number: 32,
  set: "TFC",
  rarity: "common",
};
