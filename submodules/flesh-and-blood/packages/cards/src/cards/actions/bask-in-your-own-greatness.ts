import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/bask-in-your-own-greatness.generated.ts";

export const baskInYourOwnGreatness = definePitchFamily(
  fabPitchFamilies["bask-in-your-own-greatness"],
  {
    abilities: () => ({
      onAttackPayCreateTokenMight: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
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
                token: "might",
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
  },
);
export const {
  red: baskInYourOwnGreatnessRed,
  yellow: baskInYourOwnGreatnessYellow,
  blue: baskInYourOwnGreatnessBlue,
} = baskInYourOwnGreatness.cards;
