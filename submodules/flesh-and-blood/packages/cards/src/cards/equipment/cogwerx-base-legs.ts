import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/cogwerx-base-legs.generated.ts";

export const cogwerxBaseLegs = defineCard(fabCardIdentitiesByCanonicalId["p6cgRTrMmWfjk6hCLH9Jt"], {
  abilities: {
    whenIsEquippedPutSteamCounter: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "equip",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "add-counter",
          counter: {
            kind: "named",
            name: "steam",
          },
          count: 1,
          target: {
            selector: "self",
          },
        },
      },
    },
    oncePerTurnInstantRemoveSteamCounterFromGain: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "instant",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 1,
          },
          {
            class: "effect",
            type: "remove-counters",
            counter: {
              kind: "named",
              name: "steam",
            },
            count: 1,
          },
        ],
      },
      condition: { type: "performed-this-turn", event: "boost", player: "controller" },
      effect: {
        type: "gain-action-points",
        amount: 1,
      },
    },
  },
});
