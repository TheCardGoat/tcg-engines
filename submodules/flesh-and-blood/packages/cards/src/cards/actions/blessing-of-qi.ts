import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/blessing-of-qi.generated.ts";

export const blessingOfQi = definePitchFamily(fabPitchFamilies["blessing-of-qi"], {
  abilities: (_parameter, { pitch }) => ({
    onStartPhaseDestroyCreateTokenModifyNumericPowerCrouchingTiger: {
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
                zone: "banished",
              },
              outputBinding: "it",
            },
            {
              type: "sequence",
              steps: [
                {
                  type: "modify-numeric",
                  property: "power",
                  op: "add",
                  amount: 4 - Number(pitch),
                  target: {
                    selector: "binding",
                    binding: "it",
                  },
                  duration: "permanent",
                },
                {
                  type: "play-card",
                  fromZones: ["banished"],
                  source: {
                    selector: "binding",
                    binding: "it",
                  },
                  duration: "this-turn",
                },
              ],
            },
          ],
        },
      },
    },
  }),
});

export const {
  red: blessingOfQiRed,
  yellow: blessingOfQiYellow,
  blue: blessingOfQiBlue,
} = blessingOfQi.cards;
