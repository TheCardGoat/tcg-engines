import { attackActionFilter, crushAbility } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/walk-in-my-shoes.generated.ts";

export const walkInMyShoes = definePitchFamily(fabPitchFamilies["walk-in-my-shoes"], {
  abilities: () => ({
    hasPowerGreaterThanBaseGetsNumber1Power: {
      kind: "resolution",
      condition: {
        type: "object-numeric-comparison",
        property: "power",
        left: "current",
        op: "gt",
        right: "base",
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
    crushAbility: crushAbility({
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "divide",
            amount: 2,
            rounding: "up",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "opponent",
              zones: ["combat-chain", "stack", "hand", "deck", "arsenal", "graveyard", "banished"],
              filter: attackActionFilter(),
              count: {
                type: "all",
              },
            },
            duration: "until-end-of-next-turn",
          },
          {
            type: "modify-numeric",
            property: "defense",
            op: "divide",
            amount: 2,
            rounding: "up",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "opponent",
              zones: ["combat-chain", "stack", "hand", "deck", "arsenal", "graveyard", "banished"],
              filter: attackActionFilter(),
              count: {
                type: "all",
              },
            },
            duration: "until-end-of-next-turn",
          },
        ],
      },
    }),
  }),
});

export const { yellow: walkInMyShoesYellow } = walkInMyShoes.cards;
