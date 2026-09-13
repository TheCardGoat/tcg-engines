import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/valahai-riven.generated.ts";

export const valahaiRiven = definePitchFamily(fabPitchFamilies["valahai-riven"], {
  abilities: () => ({
    payForSeismicSurges: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "optional",
              effect: {
                type: "pay",
                cost: {
                  class: "asset",
                  type: "resources",
                  amount: {
                    type: "up-to",
                    amount: 3,
                  },
                },
                payer: "controller",
              },
            },
            {
              type: "create-token",
              token: "seismic-surge",
              controller: "controller",
              count: {
                type: "count",
                what: "resources-paid-this-way",
              },
            },
          ],
        },
      },
    },
  }),
});

export const { yellow: valahaiRivenYellow } = valahaiRiven.cards;
