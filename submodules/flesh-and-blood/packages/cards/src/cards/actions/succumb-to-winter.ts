import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fusion } from "../shared/keywords.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/succumb-to-winter.generated.ts";

export const succumbToWinter = definePitchFamily(fabPitchFamilies["succumb-to-winter"], {
  keywords: [fusion("Ice")],
  abilities: (_parameter, { pitch }) => ({
    resolutionSequence: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "deal-damage",
            damageType: "arcane",
            amount: 6 - Number(pitch),
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["hero", "permanent"],
              count: 1,
            },
          },
          {
            type: "conditional",
            condition: {
              type: "and",
              conditions: [
                {
                  type: "has-status",
                  status: "fused",
                },
                {
                  type: "has-status",
                  status: "targets-a-hero",
                },
              ],
            },
            then: {
              type: "destroy",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "opponent",
                zones: ["arsenal"],
                filter: {
                  hasStatus: "frozen",
                },
                count: 1,
              },
            },
          },
          {
            type: "conditional",
            condition: {
              type: "and",
              conditions: [
                {
                  type: "has-status",
                  status: "fused",
                },
                {
                  type: "has-status",
                  status: "targets-a-frozen-ally",
                },
              ],
            },
            then: {
              type: "destroy",
              target: {
                selector: "binding",
                binding: "damage-target",
              },
            },
          },
        ],
      },
    },
  }),
});

export const {
  red: succumbToWinterRed,
  yellow: succumbToWinterYellow,
  blue: succumbToWinterBlue,
} = succumbToWinter.cards;
