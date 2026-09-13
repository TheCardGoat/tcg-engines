import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/emerging-power.generated.ts";
import { goAgain } from "../shared/keywords.ts";
export const emergingPower = definePitchFamily(fabPitchFamilies["emerging-power"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  keywords: [goAgain],
  abilities: (amount) => ({
    staticTriggeredActionPhaseStartSequence: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "action-phase-start",
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
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: amount,
              target: {
                selector: "this-attack",
              },
              duration: "this-turn",
              appliesTo: {
                next: {
                  typeBox: {
                    supertypes: ["Guardian"],
                    types: ["Action"],
                    subtypes: ["Attack"],
                  },
                },
              },
            },
          ],
        },
      },
    },
  }),
});
export const {
  red: emergingPowerRed,
  yellow: emergingPowerYellow,
  blue: emergingPowerBlue,
} = emergingPower.cards;
