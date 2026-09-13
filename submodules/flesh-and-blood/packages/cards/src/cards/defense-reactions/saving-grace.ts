import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/saving-grace.generated.ts";

export const savingGrace = definePitchFamily(fabPitchFamilies["saving-grace"], {
  abilities: () => ({
    chargeAsAdditionalCost: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "charge",
        },
        optional: true,
      },
      label: {
        name: "charge",
      },
    },
    weakenAttackAfterCharge: {
      kind: "resolution",
      condition: { type: "performed-this-turn", event: "charge", player: "controller" },
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
        outputBinding: "it",
      },
      label: {
        name: "charge",
      },
    },
  }),
});

export const { yellow: savingGraceYellow } = savingGrace.cards;
