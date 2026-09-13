import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/trot-along.generated.ts";
import { goAgain } from "../shared/keywords.ts";

/** Model notes (hand-authored): printed "next attack" includes weapon attacks. */
export const trotAlong = definePitchFamily(fabPitchFamilies["trot-along"], {
  keywords: [goAgain],
  abilities: () => ({
    nextAttackWithNumber3LessBasePowerTurnGetsGoAgain: {
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
            power: {
              op: "lte",
              value: 3,
            },
          },
        },
      },
    },
  }),
});

export const { blue: trotAlongBlue } = trotAlong.cards;
