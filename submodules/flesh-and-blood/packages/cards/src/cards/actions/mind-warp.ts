import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/mind-warp.generated.ts";

export const mindWarp = definePitchFamily(fabPitchFamilies["mind-warp"], {
  abilities: () => ({
    deal2ArcaneDamageTarget: {
      kind: "resolution",
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: 2,
        target: {
          selector: "any-hero",
        },
      },
    },
    dealsMoreThan2DamageShuffleHandDeckThenDrawManyMinus1: {
      kind: "resolution",
      condition: {
        type: "source-damage-dealt",
        per: "turn",
        comparison: { op: "gt", value: 2 },
        toHero: true,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "opponent",
              zones: ["hand"],
              count: {
                type: "all",
              },
            },
            to: {
              zone: "deck",
              shuffle: true,
            },
          },
          {
            type: "draw",
            count: {
              type: "difference",
              operands: [
                {
                  type: "count",
                  what: "shuffled-this-way",
                },
                1,
              ],
            },
            player: "opponent",
          },
        ],
      },
      label: {
        name: "surge",
      },
    },
  }),
});

export const { yellow: mindWarpYellow } = mindWarp.cards;
