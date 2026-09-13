import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/blessing-of-aegis.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const blessingOfAegis = definePitchFamily(fabPitchFamilies["blessing-of-aegis"], {
  keywords: [goAgain],
  abilities: () => ({
    wheneverIsPutIntoSoulGain1: {
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
          type: "gain-life",
          amount: 1,
          target: {
            selector: "controller",
          },
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
export const { yellow: blessingOfAegisYellow } = blessingOfAegis.cards;
