import { goAgain, overpower } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/bank-breaker.generated.ts";

export const bankBreaker = defineCard(fabCardIdentitiesByCanonicalId["hHTFWRhbq9F7CwwbQqNQ8"], {
  abilities: {
    twicePerTurnActionResourceAttackActivateOnlyCrankedTurn: {
      kind: "activated",
      limit: {
        count: 2,
        per: "turn",
      },
      abilityType: "attack",
      cost: {
        class: "asset",
        type: "resources",
        amount: 1,
      },
      condition: { type: "performed-this-turn", event: "crank", player: "controller" },
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
    attacksBanishAttackGetsOverpowerGoAgain: {
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
          type: "optional",
          effect: {
            type: "banish",
            target: {
              selector: "sub-cards",
            },
          },
          then: {
            type: "sequence",
            steps: [
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
              },
            ],
          },
        },
      },
    },
  },
});
