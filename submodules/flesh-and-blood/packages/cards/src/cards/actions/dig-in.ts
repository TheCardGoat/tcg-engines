import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/dig-in.generated.ts";

export const digIn = definePitchFamily(fabPitchFamilies["dig-in"], {
  abilities: () => ({
    onDefendPayCreateTokenToughness: {
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
              token: "toughness",
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
export const { red: digInRed, yellow: digInYellow, blue: digInBlue } = digIn.cards;
