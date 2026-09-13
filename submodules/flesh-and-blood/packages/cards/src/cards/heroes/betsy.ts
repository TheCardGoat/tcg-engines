import { overpower } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/betsy.generated.ts";

export const betsy = defineCard(fabCardIdentitiesByCanonicalId["zdWrPkDgdbWdGBWjCLnhj"], {
  abilities: {
    wheneverAttackWagersPayResourceResourceAttackGets1PowerOverpower: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "wager",
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
          type: "optional",
          effect: {
            type: "pay",
            cost: {
              class: "asset",
              type: "resources",
              amount: 2,
            },
            payer: "controller",
          },
          then: {
            type: "sequence",
            steps: [
              {
                type: "modify-numeric",
                property: "power",
                op: "add",
                amount: 1,
                target: {
                  selector: "this-attack",
                },
                duration: "this-turn",
              },
              {
                type: "grant-property",
                property: {
                  kind: "keyword",
                  keyword: overpower,
                },
                target: {
                  selector: "this-attack",
                },
                duration: "this-turn",
              },
            ],
          },
        },
      },
    },
  },
});
