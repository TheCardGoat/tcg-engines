import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/light-up-the-leaves.generated.ts";

export const lightUpTheLeaves = definePitchFamily(fabPitchFamilies["light-up-the-leaves"], {
  abilities: () => ({
    deal6ArcaneDamageAnyTarget: {
      kind: "resolution",
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: 6,
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["hero", "permanent"],
          count: 1,
        },
      },
    },
    instantDiscardEarthPreventNext6ArcaneDamageTargetSourceDealTurn: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "effect",
            type: "discard-self",
          },
          {
            class: "effect",
            type: "discard",
            count: 1,
            filter: {
              typeBox: {
                supertypes: ["Earth"],
              },
            },
          },
        ],
      },
      effect: {
        type: "prevention",
        preventionKind: "fixed",
        amount: 6,
        damageType: "arcane",
        source: {
          selector: "object",
          declared: "at-resolution",
          zones: ["combat-chain", "permanent", "stack"],
          count: 1,
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { red: lightUpTheLeavesRed } = lightUpTheLeaves.cards;
