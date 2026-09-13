import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/hot-streak.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const hotStreak = defineCard(fabCardIdentitiesByCanonicalId["WKGJ7ktHDWrtCBnC9J7gW"], {
  abilities: {
    oncePerTurnActionResourceAttack: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "attack",
      cost: {
        class: "asset",
        type: "resources",
        amount: 1,
      },
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
    defended1MoreAttackActionHotStreaksAttacksGetGoAgainTurn: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "event-object",
            selector: "defender",
            relationship: {
              kind: "any",
            },
            filter: attackActionFilter(),
          },
          amount: {
            op: "gte",
            value: 1,
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: goAgain,
          },
          target: {
            selector: "this-attack",
          },
          duration: "while-in-arena",
        },
      },
    },
  },
});
