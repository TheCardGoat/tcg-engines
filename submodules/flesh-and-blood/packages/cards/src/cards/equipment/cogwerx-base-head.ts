import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/cogwerx-base-head.generated.ts";

export const cogwerxBaseHead = defineCard(fabCardIdentitiesByCanonicalId["KGBQtW9fTBCjQpqQTpHNz"], {
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
    oncePerTurnInstantRemoveSteamCounterFromShuffle: {
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
        type: "sequence",
        steps: [
          {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["banished"],
              // Mechanologist attack action: class is a type-line supertype;
              // use loose types filter so Action + Mechanologist both match.
              filter: {
                typeBox: {
                  supertypes: ["Mechanologist"],
                  types: ["Action"],
                  subtypes: ["Attack"],
                },
              },
              count: 1,
            },
            to: {
              zone: "deck",
            },
          },
          {
            type: "shuffle",
            zone: "deck",
          },
        ],
      },
    },
  },
});
