import type { ActivatedAbility } from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const drFacilierCards: LorcanaItemCardDefinition = {
  characteristics: ["item"],
  id: "s8n",

  name: "Dr. Facilier's Cards",
  text: "**THE CARDS WILL TELL** {E} − You pay 1 {I} less for the next action you play this turn.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "The Cards Will Tell",
      text: "You pay 1 {I} less for the next action you play this turn.",
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
            filters: [{ filter: "type", value: "action" }],
          },
        },
      ],
    } as ActivatedAbility,
  ],
  flavour: "Take a little trip into your future with me! \n−Dr. Facilier",
  colors: ["emerald"],
  cost: 2,
  illustrator: "Koni",
  number: 101,
  set: "TFC",
  rarity: "uncommon",
};
