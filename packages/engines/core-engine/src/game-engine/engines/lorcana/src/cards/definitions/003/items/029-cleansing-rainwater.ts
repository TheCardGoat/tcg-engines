import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import type { ActivatedAbility } from "~/game-engine/engines/lorcana/src/abilities";

export const cleansingRainwater: LorcanaItemCardDefinition = {
  id: "vlr",
  name: "Cleansing Rainwater",
  characteristics: ["item"],
  text: "**ANCIENT POWER** Banish this item – Remove up to 2 damage from each of your characters.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "ANCIENT POWER",
      text: "Banish this item – Remove up to 2 damage from each of your characters.",
      costs: [{ type: "banish" }],
      effects: [
        {
          type: "heal",
          amount: 2,
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "type", value: "character" },
              { filter: "owner", value: "self" },
              { filter: "zone", value: "play" },
            ],
          },
        },
      ],
    } as ActivatedAbility,
  ],
  flavour: "Rainwater lands as stone melts and dragons fly again.",
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  illustrator: 'Michael "Cookie" Niewiadomy',
  number: 29,
  set: "ITI",
  rarity: "common",
};
