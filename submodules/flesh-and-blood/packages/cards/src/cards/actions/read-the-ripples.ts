import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/read-the-ripples.generated.ts";
import { opt } from "../shared/keywords.ts";

export const readTheRipples = definePitchFamily(fabPitchFamilies["read-the-ripples"], {
  keywords: [opt(1)],
  abilities: (_parameter, { pitch }) => ({
    triggeredEndPhaseSequenceDestroyDraw: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "end-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
            ...(pitch === "1"
              ? [{ type: "opt" as const, count: 1 }]
              : pitch === "2"
                ? [
                    { type: "opt" as const, count: 1 },
                    { type: "opt" as const, count: 1 },
                  ]
                : [
                    { type: "opt" as const, count: 1 },
                    { type: "opt" as const, count: 1 },
                    { type: "opt" as const, count: 1 },
                  ]),
            {
              type: "draw",
              count: 1,
              player: "controller",
            },
          ],
        },
      },
    },
  }),
});

export const {
  red: readTheRipplesRed,
  yellow: readTheRipplesYellow,
  blue: readTheRipplesBlue,
} = readTheRipples.cards;
