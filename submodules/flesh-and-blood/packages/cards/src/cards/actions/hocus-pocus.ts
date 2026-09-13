import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/hocus-pocus.generated.ts";

export const hocusPocus = definePitchFamily(fabPitchFamilies["hocus-pocus"], {
  abilities: () => ({
    triggeredAttackCreateTokenRunechant: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "runechant",
          controller: "controller",
        },
      },
    },
  }),
});

export const {
  red: hocusPocusRed,
  yellow: hocusPocusYellow,
  blue: hocusPocusBlue,
} = hocusPocus.cards;
