import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/agility-stance.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const agilityStance = definePitchFamily(fabPitchFamilies["agility-stance"], {
  keywords: [goAgain],
  abilities: () => ({
    atStartTurnDestroyThenDaggerAttacksGetGo: {
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
              type: "grant-property",
              property: {
                kind: "keyword",
                keyword: goAgain,
              },
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
export const { yellow: agilityStanceYellow } = agilityStance.cards;
