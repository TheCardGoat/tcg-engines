import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/entangling-shot.generated.ts";

export const entanglingShot = definePitchFamily(fabPitchFamilies["entangling-shot"], {
  abilities: () => ({
    whenIsPutFaceUpIntoArsenalMayTarget: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "move-zone",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "event-object",
            selector: "moved-object",
            relationship: {
              kind: "any",
            },
            filter: {
              hasStatus: "face-up",
            },
            bindAs: "it",
          },
          to: "arsenal",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "tap",
            // "Target hero" resolves through the hero-seat selector; there is
            // no stack at enter-arsenal time, so the on-stack form never
            // resolved.
            target: {
              selector: "hero",
              who: "opponent",
            },
          },
        },
      },
    },
  }),
});
export const { red: entanglingShotRed } = entanglingShot.cards;
