import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/power-stance.generated.ts";

export const powerStance = definePitchFamily(fabPitchFamilies["power-stance"], {
  keywords: [goAgain],
  abilities: () => ({
    startTurnDestroyThenDaggerAttacksGet1PowerTurn: {
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
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: 1,
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["combat-chain"],
                filter: {
                  typeBox: {
                    subtypes: ["Dagger"],
                  },
                },
                count: {
                  type: "all",
                },
              },
              duration: "this-turn",
            },
          ],
        },
      },
    },
  }),
});

export const { blue: powerStanceBlue } = powerStance.cards;
