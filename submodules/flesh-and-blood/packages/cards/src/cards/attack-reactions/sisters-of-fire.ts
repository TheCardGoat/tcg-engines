import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/sisters-of-fire.generated.ts";

export const sistersOfFire = definePitchFamily(fabPitchFamilies["sisters-of-fire"], {
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
        amount: 3,
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

export const { red: sistersOfFireRed } = sistersOfFire.cards;
