import { beatChest } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/bare-swing.generated.ts";

export const bareSwing = definePitchFamily(fabPitchFamilies["bare-swing"], {
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
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 2,
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
      },
    },
  }),
});
export const { red: bareSwingRed, yellow: bareSwingYellow } = bareSwing.cards;
