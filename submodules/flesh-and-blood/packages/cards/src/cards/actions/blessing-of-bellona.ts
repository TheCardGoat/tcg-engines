import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/blessing-of-bellona.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const blessingOfBellona = definePitchFamily(fabPitchFamilies["blessing-of-bellona"], {
  keywords: [goAgain],
  abilities: () => ({
    wheneverIsPutIntoSoulCreateCourageToken: {
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
            kind: "none",
          },
          to: "soul",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "courage",
          controller: "controller",
        },
      },
    },
    atStartTurnPutIntoSoul: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "start-phase",
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
          type: "move-card",
          target: {
            selector: "self",
          },
          to: {
            zone: "soul",
          },
        },
      },
    },
  }),
});
export const { yellow: blessingOfBellonaYellow } = blessingOfBellona.cards;
