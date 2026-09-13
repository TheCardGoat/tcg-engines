import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/rockslide-trap.generated.ts";

export const rockslideTrap = definePitchFamily(fabPitchFamilies["rockslide-trap"], {
  abilities: () => ({
    arsenalOnly: {
      kind: "static",
      staticKind: "play",
      condition: {
        type: "played-this",
        per: "turn",
        onlySource: true,
        filter: { playedFromZones: ["arsenal"] },
      },
      playEffect: {
        role: "condition",
      },
    },
    minusTwoPowerUnlessAttackerPays: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "unless",
          effect: {
            type: "modify-numeric",
            property: "power",
            op: "subtract",
            amount: 2,
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["combat-chain"],
              filter: {
                typeBox: {
                  subtypes: ["Attack"],
                },
              },
              count: 1,
            },
            duration: "this-turn",
          },
          escape: {
            type: "pay",
            cost: {
              class: "asset",
              type: "resources",
              amount: 1,
            },
            payer: "attacking-hero",
          },
        },
      },
    },
  }),
});

export const { blue: rockslideTrapBlue } = rockslideTrap.cards;
