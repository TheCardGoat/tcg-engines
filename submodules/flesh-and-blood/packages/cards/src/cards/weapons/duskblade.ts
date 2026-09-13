import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/duskblade.generated.ts";

export const duskblade = defineCard(fabCardIdentitiesByCanonicalId["HkDzFgnhCBGn6K9w7RWtC"], {
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
    wheneverAttackDuskbladePlayedAttackActionNonAttackActionTurnPut1PowerCounterDuskblade: {
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
            kind: "event-object",
            selector: "attack",
            relationship: {
              kind: "any",
            },
            filter: {
              name: "Duskblade",
            },
          },
        },
        state: {
          type: "and",
          conditions: [
            {
              type: "played-this",
              per: "turn",
              filter: attackActionFilter(),
              comparison: { op: "gte", value: 1 },
            },
            {
              type: "played-this",
              per: "turn",
              filter: { typeBox: { types: ["Action"], excludeSubtypes: ["Attack"] } },
              comparison: { op: "gte", value: 1 },
            },
          ],
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "add-counter",
          counter: {
            kind: "numeric",
            value: 1,
            property: "power",
          },
          count: 1,
          target: {
            selector: "self",
          },
        },
      },
    },
    beginningEndPhaseHaventPlayedAttackActionNonAttackActionTurnRemoveAll1PowerCountersDuskblade: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "end-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
        state: {
          type: "not",
          condition: {
            type: "and",
            conditions: [
              {
                type: "played-this",
                per: "turn",
                filter: attackActionFilter(),
                comparison: { op: "gte", value: 1 },
              },
              {
                type: "played-this",
                per: "turn",
                filter: { typeBox: { types: ["Action"], excludeSubtypes: ["Attack"] } },
                comparison: { op: "gte", value: 1 },
              },
            ],
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "remove-counters",
          counter: {
            kind: "numeric",
            value: 1,
            property: "power",
          },
          count: {
            type: "all",
          },
          target: {
            selector: "self",
          },
        },
      },
    },
  },
});
