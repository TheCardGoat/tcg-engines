import type { ActivatedAbility } from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const gumboPot: LorcanaItemCardDefinition = {
  id: "xf3",

  name: "Gumbo Pot",
  characteristics: ["item"],
  text: "**THE BEST I'VE EVER TASTED** {E} − Remove 1 damage each from up to 2 chosen characters.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "The Best I've Ever Tasted",
      text: "{E} − Remove 1 damage each from up to 2 chosen characters.",
      optional: false,
      costs: [{ type: "exert" }],
      effects: [
        {
          type: "heal",
          amount: 1,
          target: {
            type: "card",
            value: 2,
            upTo: true,
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
  flavour: "A gift this special just got to be shared. \n−James",
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  illustrator: "Tanisha Cherislin",
  number: 167,
  set: "ROF",
  rarity: "common",
};
