import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/on-a-knife-edge.generated.ts";

export const onAKnifeEdge = definePitchFamily(fabPitchFamilies["on-a-knife-edge"], {
  keywords: [goAgain],
  abilities: () => ({
    nextSwordAttackTurnGainsGoAgain: {
      kind: "resolution",
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
        },
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Sword"],
            },
          },
        },
      },
    },
  }),
});

export const { yellow: onAKnifeEdgeYellow } = onAKnifeEdge.cards;
