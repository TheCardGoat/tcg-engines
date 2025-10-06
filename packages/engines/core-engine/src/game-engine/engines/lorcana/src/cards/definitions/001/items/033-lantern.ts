import type { ActivatedAbility } from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const lantern: LorcanaItemCardDefinition = {
  characteristics: ["item"],
  id: "ub2",
  reprints: ["aa1"],

  name: "Lantern",
  text: "**BIRTHDAY LIGHTS** {E} - You pay 1 {I} less for the next character you play this turn.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "Birthday Lights",
      text: "{E} - You pay 1 {I} less for the next character you play this turn.",
      optional: false,
      costs: [{ type: "exert" }],
      effects: [
        {
          type: "replacement",
          replacement: "cost",
          duration: "next",
          amount: 1,
          target: {
            type: "card",
            value: "all",
            filters: [{ filter: "type", value: "character" }],
          },
        },
      ],
    } as ActivatedAbility,
  ],
  flavour:
    "Lanterns fill the sky on one special night, beacons of hope and love.",
  colors: ["amber"],
  cost: 2,
  illustrator: "Eri Welli",
  number: 33,
  set: "TFC",
  rarity: "rare",
};
