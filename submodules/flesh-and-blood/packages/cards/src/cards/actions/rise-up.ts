import { dominate } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rise-up.generated.ts";

export const riseUp = definePitchFamily(fabPitchFamilies["rise-up"], {
  keywords: [
    {
      name: "specialization",
      hero: "Dromai or Fai",
    },
    dominate,
  ],
  abilities: () => ({
    riseUpPlayedChainLink4HigherDominateXPowerWhereXTwiceNumberPhoenixFlames: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "has-status",
        status: "played-at-chain-link-4-or-higher",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: dominate,
            },
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: {
              type: "double",
              operands: [
                {
                  type: "count",
                  what: "cards-in-zone",
                  zone: "combat-chain",
                  player: "controller",
                  filter: {
                    name: "Phoenix Flame",
                  },
                },
              ],
            },
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
        ],
      },
      label: {
        name: "rupture",
      },
    },
  }),
});

export const { red: riseUpRed } = riseUp.cards;
