import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/seeping-shadows.generated.ts";
import { bloodDebt, goAgain } from "../shared/keywords.ts";

export const seepingShadows = definePitchFamily(fabPitchFamilies["seeping-shadows"], {
  parameters: pitchMap({ red: 2, yellow: 1, blue: 0 }),
  keywords: [goAgain, bloodDebt],
  abilities: (maxCost) => ({
    playStaticEffect: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "permission",
        fromZones: ["banished"],
      },
    },
    resolutionSequence: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: nextAttackActionLatch({
              cost: {
                op: maxCost === 0 ? "eq" : "lte",
                value: maxCost,
              },
            }),
          },
          {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: goAgain,
            },
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: nextAttackActionLatch({
              cost: {
                op: maxCost === 0 ? "eq" : "lte",
                value: maxCost,
              },
            }),
          },
        ],
      },
    },
  }),
});

export const {
  red: seepingShadowsRed,
  yellow: seepingShadowsYellow,
  blue: seepingShadowsBlue,
} = seepingShadows.cards;
