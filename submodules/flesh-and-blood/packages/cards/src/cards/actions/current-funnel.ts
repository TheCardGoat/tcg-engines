import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/current-funnel.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const currentFunnel = definePitchFamily(fabPitchFamilies["current-funnel"], {
  abilities: () => ({
    whenAttacksIfLastActionPlayedTurnWasLightning: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
        },
        state: {
          type: "last-action-this-turn",
          filter: { typeBox: { supertypes: ["Lightning"] } },
          excludeSource: true,
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "grant-property",
              property: {
                kind: "keyword",
                keyword: goAgain,
              },
              target: {
                selector: "self",
              },
              duration: "this-turn",
            },
            {
              type: "grant-property",
              property: {
                kind: "keyword",
                keyword: goAgain,
              },
              target: {
                selector: "this-attack",
              },
              duration: "this-turn",
              appliesTo: {
                next: {
                  typeBox: {
                    types: ["Action"],
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
export const { blue: currentFunnelBlue } = currentFunnel.cards;
