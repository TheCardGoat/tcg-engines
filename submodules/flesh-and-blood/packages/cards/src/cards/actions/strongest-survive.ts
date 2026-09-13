import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/strongest-survive.generated.ts";

export const strongestSurvive = definePitchFamily(fabPitchFamilies["strongest-survive"], {
  abilities: () => ({
    triggeredStaticOnHitEffect: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "unless",
          effect: {
            type: "discard",
            target: {
              selector: "attack-target",
            },
          },
          escape: {
            type: "reveal",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "attack-target",
              zones: ["hand"],
              filter: {
                numeric: [
                  {
                    property: "power",
                    basis: "current",
                    comparison: {
                      op: "gt",
                      value: {
                        type: "reference",
                        binding: "trigger-event-damage",
                        missing: "zero",
                      },
                    },
                  },
                ],
              },
              count: 1,
            },
          },
        },
      },
    },
  }),
});

export const {
  red: strongestSurviveRed,
  yellow: strongestSurviveYellow,
  blue: strongestSurviveBlue,
} = strongestSurvive.cards;
