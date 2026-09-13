import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/reincarnate.generated.ts";

export const reincarnate = definePitchFamily(fabPitchFamilies["reincarnate"], {
  abilities: () => ({
    triggeredDiscardMoveCard: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "discard",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "none",
          },
          random: true,
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "move-card",
          target: {
            selector: "self",
          },
          to: {
            zone: "deck",
            position: "bottom",
          },
        },
      },
    },
  }),
});

export const {
  red: reincarnateRed,
  yellow: reincarnateYellow,
  blue: reincarnateBlue,
} = reincarnate.cards;
