import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/stormshatter.generated.ts";

export const stormshatter = definePitchFamily(fabPitchFamilies["stormshatter"], {
  abilities: () => ({
    mayDestroyLightningFlowControlRatherThanPayS: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "alternative-cost",
        cost: {
          class: "effect",
          type: "destroy",
          filter: {
            name: "Lightning Flow",
          },
        },
        optional: true,
      },
    },
    targetLightningAttackGets3: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "subtract",
        amount: 3,
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: {
            typeBox: {
              supertypes: ["Lightning"],
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

export const { yellow: stormshatterYellow } = stormshatter.cards;
