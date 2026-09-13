import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/bare-destruction.generated.ts";

import { beatChest, goAgain } from "../shared/keywords.ts";

export const bareDestruction = definePitchFamily(fabPitchFamilies["bare-destruction"], {
  keywords: [beatChest],
  abilities: () => ({
    whenAttacksIfVeBeatenChestTurnDonT: {
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
          type: "and",
          conditions: [
            { type: "performed-this-turn", event: "beat-chest", player: "controller" },
            {
              type: "not",
              condition: {
                type: "control-object",
                filter: {
                  and: [
                    {
                      typeBox: {
                        subtypes: ["Chest"],
                      },
                    },
                    {
                      typeBox: {
                        types: ["Equipment"],
                      },
                    },
                  ],
                },
              },
            },
          ],
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
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: 2,
              target: {
                selector: "this-attack",
              },
              duration: "this-turn",
              appliesTo: {
                next: {
                  typeBox: {
                    supertypes: ["Brute"],
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
export const { red: bareDestructionRed } = bareDestruction.cards;
