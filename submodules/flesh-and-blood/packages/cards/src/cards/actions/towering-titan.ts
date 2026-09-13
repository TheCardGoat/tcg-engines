import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/towering-titan.generated.ts";

export const toweringTitan = definePitchFamily(fabPitchFamilies["towering-titan"], {
  parameters: pitchMap({ red: 10, yellow: 9, blue: 8 }),
  abilities: (amount) => ({
    triggeredStaticOnActionPhaseStartEffect: {
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
  red: toweringTitanRed,
  yellow: toweringTitanYellow,
  blue: toweringTitanBlue,
} = toweringTitan.cards;
