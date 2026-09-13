import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/mindstate-of-tiger.generated.ts";

export const mindstateOfTiger = definePitchFamily(fabPitchFamilies["mindstate-of-tiger"], {
  abilities: () => ({
    startTurnDestroyMindstateTigerThenCreateCrouchingTigerHand: {
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
          type: "sequence",
          steps: [
            {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
            {
              type: "create-token",
              token: "crouching-tiger",
              controller: "controller",
              to: {
                zone: "hand",
              },
            },
          ],
        },
      },
    },
  }),
});

export const { blue: mindstateOfTigerBlue } = mindstateOfTiger.cards;
