import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/throw-dagger.generated.ts";

export const throwDagger = definePitchFamily(fabPitchFamilies["throw-dagger"], {
  abilities: () => ({
    dealDamageWithDagger: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "deal-damage",
            damageType: "generic",
            amount: 1,
            target: {
              selector: "defending-hero",
            },
            source: {
              selector: "object",
              declared: "on-stack",
              zones: ["combat-chain"],
              filter: {
                typeBox: {
                  subtypes: ["Dagger"],
                },
              },
              count: 1,
            },
          },
          {
            type: "conditional",
            condition: {
              type: "binding-numeric",
              binding: "damage-dealt-this-way",
              comparison: { op: "gt", value: 0 },
            },
            then: {
              type: "sequence",
              steps: [
                {
                  type: "set-status",
                  status: "hit",
                  target: {
                    selector: "binding",
                    binding: "it",
                  },
                },
                {
                  type: "draw",
                  count: 1,
                  player: "controller",
                },
              ],
            },
          },
          {
            type: "destroy",
            target: {
              selector: "binding",
              binding: "it",
            },
          },
        ],
      },
    },
  }),
});

export const { blue: throwDaggerBlue } = throwDagger.cards;
