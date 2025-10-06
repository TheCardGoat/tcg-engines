import type { ActivatedAbility } from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const magicGoldenFlower: LorcanaItemCardDefinition = {
  characteristics: ["item"],
  id: "foq",

  name: "Magic Golden Flower",
  text: "**HEALING POLLEN** Banish this item - Remove up to 3 damage from chosen character.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "Healing Pollen",
      text: "Banish this item - Remove up to 3 damage from chosen character.",
      costs: [{ type: "banish" }],
      effects: [
        {
          type: "heal",
          amount: 3,
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
  flavour:
    "Once upon a time, a single drop of sunlight fell from the heavens. . . . \n−Flynn Rider",
  inkwell: true,
  colors: ["sapphire"],
  cost: 1,
  illustrator: "Cory Godbey",
  number: 169,
  set: "TFC",
  rarity: "common",
};
