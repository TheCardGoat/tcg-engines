import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/bloodrush-bellow.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const bloodrushBellow = definePitchFamily(fabPitchFamilies["bloodrush-bellow"], {
  abilities: () => ({
    asAdditionalCostPlayBloodrushBellowDiscardRandom: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "discard",
          count: 1,
          random: true,
        },
      },
    },
    bruteAttacksGain2Turn: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 2,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              supertypes: ["Brute"],
            },
          },
          count: { type: "all" },
        },
      },
    },
    ifDiscardedHas6MoreDraw2BloodrushBellow: {
      kind: "resolution",
      condition: {
        type: "binding-matches",
        binding: "discardedCard",
        filter: {
          power: {
            op: "gte",
            value: 6,
          },
        },
      },
      layerKeywords: [goAgain],
      effect: {
        type: "draw",
        count: 2,
        player: "controller",
      },
    },
  }),
});
export const { yellow: bloodrushBellowYellow } = bloodrushBellow.cards;
