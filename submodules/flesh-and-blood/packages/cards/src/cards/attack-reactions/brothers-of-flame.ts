import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/brothers-of-flame.generated.ts";

export const brothersOfFlame = definePitchFamily(fabPitchFamilies["brothers-of-flame"], {
  abilities: () => ({
    requireDraconicChainLinks: {
      kind: "static",
      staticKind: "play",
      condition: {
        type: "compare-amount",
        amount: {
          type: "count",
          what: "chain-links",
          player: "controller",
          filter: { typeBox: { supertypes: ["Draconic"] } },
        },
        comparison: { op: "gte", value: 2 },
      },
      playEffect: {
        role: "condition",
      },
    },
    boostDaggerAttack: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 4,
        target: {
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
        duration: "this-turn",
        outputBinding: "it",
      },
    },
  }),
});

export const { red: brothersOfFlameRed } = brothersOfFlame.cards;
