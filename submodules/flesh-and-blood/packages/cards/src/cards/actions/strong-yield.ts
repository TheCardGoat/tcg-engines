import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/strong-yield.generated.ts";

export const strongYield = definePitchFamily(fabPitchFamilies["strong-yield"], {
  keywords: [goAgain],

  abilities: () => ({
    createMightAtActionPhaseStart: {
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
              amount: 3,
              target: {
                selector: "this-attack",
              },
              duration: "this-turn",
              appliesTo: {
                next: {
                  typeBox: {
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
  red: strongYieldRed,
  yellow: strongYieldYellow,
  blue: strongYieldBlue,
} = strongYield.cards;
