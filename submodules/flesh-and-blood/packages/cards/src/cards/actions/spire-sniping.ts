import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/spire-sniping.generated.ts";

export const spireSniping = definePitchFamily(fabPitchFamilies["spire-sniping"], {
  parameters: pitchMap({
    red: { value1: 2, textValue1: 2 },
    yellow: { value1: 2, textValue1: 2 },
    blue: { value1: 2, textValue1: 2 },
  }),
  abilities: ({ value1, textValue1: _textValue1 }) => ({
    triggeredStaticEffect: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          kind: "any-of",
          patterns: [
            {
              name: "move-zone",
              actor: { kind: "any" },
              observes: {
                kind: "event-object",
                selector: "moved-object",
                relationship: { kind: "any" },
                filter: { hasStatus: "face-up" },
                bindAs: "it",
              },
              to: "arsenal",
            },
            {
              name: "turn-face-up",
              actor: { kind: "any" },
              observes: {
                kind: "source",
                selector: "object",
              },
            },
          ],
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "look",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["deck"],
                position: "top",
                count: value1,
              },
              outputBinding: "them",
            },
            {
              type: "reorder-deck",
              target: {
                selector: "binding",
                binding: "them",
              },
              position: "top",
            },
          ],
        },
      },
    },
  }),
});

export const {
  red: spireSnipingRed,
  yellow: spireSnipingYellow,
  blue: spireSnipingBlue,
} = spireSniping.cards;
