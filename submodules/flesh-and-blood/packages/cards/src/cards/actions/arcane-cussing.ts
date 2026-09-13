import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/arcane-cussing.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const arcaneCussing = definePitchFamily(fabPitchFamilies["arcane-cussing"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  keywords: [goAgain],
  abilities: (count) => ({
    staticTriggeredDealDamageDealDamageDestroy: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "deal-damage",
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
          type: "destroy",
          target: {
            selector: "self",
          },
        },
      },
    },
    staticTriggeredDealtDamageDealtDamageDestroy: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "dealt-damage",
          actor: {
            kind: "player",
            player: "opponent",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "destroy",
          target: {
            selector: "self",
          },
        },
      },
    },
    staticTriggeredTurnPlayerLeaveArenaLeaveArenaCreateToken: {
      kind: "static",
      staticKind: "triggered",
      condition: {
        type: "turn-player",
        who: "self",
      },
      trigger: {
        kind: "event",
        event: {
          name: "leave-arena",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "runechant",
          controller: "controller",
          count,
        },
      },
    },
  }),
});

export const {
  red: arcaneCussingRed,
  yellow: arcaneCussingYellow,
  blue: arcaneCussingBlue,
} = arcaneCussing.cards;
