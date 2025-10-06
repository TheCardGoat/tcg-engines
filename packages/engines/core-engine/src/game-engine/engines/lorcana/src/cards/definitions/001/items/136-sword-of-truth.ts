import type { ActivatedAbility } from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const swordOfTruth: LorcanaItemCardDefinition = {
  characteristics: ["item"],
  id: "jpg",

  name: "Sword of Truth",
  text: "**FINAL ENCHANTMENT** Banish this item − Banish chosen Villain character.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "Final Enchantment",
      text: "Banish this item − Banish chosen Villain character.",
      costs: [{ type: "banish" }],
      effects: [
        {
          type: "banish",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "zone", value: "play" },
              { filter: "type", value: "character" },
              { filter: "characteristics", value: ["villain"] },
            ],
          },
        },
      ],
    } as ActivatedAbility,
  ],
  flavour: "Almost as powerful as True Love's Kiss.",
  colors: ["ruby"],
  cost: 4,
  illustrator: "Andrew Trabbold",
  number: 136,
  set: "TFC",
  rarity: "rare",
};
