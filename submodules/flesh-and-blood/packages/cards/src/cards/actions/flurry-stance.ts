import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/flurry-stance.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const flurryStance = definePitchFamily(fabPitchFamilies["flurry-stance"], {
  keywords: [goAgain],
  abilities: () => ({
    atStartTurnDestroyThenMayAttackEachDagger: {
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
              // CR 5.2.3c: the start-of-turn grant applies to every dagger by
              // itself; no on-resolution decision exists.
              type: "modify-activation-limit",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["weapon", "permanent"],
                filter: {
                  typeBox: {
                    subtypes: ["Dagger"],
                  },
                },
                count: {
                  type: "all",
                },
              },
              operation: "additional",
              count: 1,
              duration: "this-turn",
            },
          ],
        },
      },
    },
  }),
});
export const { red: flurryStanceRed } = flurryStance.cards;
