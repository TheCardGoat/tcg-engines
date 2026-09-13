import { goAgain, piercing } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/orbitoclast.generated.ts";

export const orbitoclast = defineCard(fabCardIdentitiesByCanonicalId["wrBpz9J66tTJtRK67FWdp"], {
  keywords: [piercing(1)],
  abilities: {
    oncePerTurnActionResourceResourceAttackGoAgain: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "attack",
      cost: {
        class: "asset",
        type: "resources",
        amount: 2,
      },
      layerKeywords: [goAgain],
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
    hitsNextTimeDefend1MoreNonAttackActionTurn1DefenseDefending: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "delayed-trigger",
          trigger: {
            kind: "event",
            event: {
              name: "defend",
              actor: {
                kind: "player",
                player: "opponent",
              },
              observes: {
                kind: "event-object",
                selector: "defender",
                relationship: {
                  kind: "any",
                },
                filter: {
                  typeBox: {
                    types: ["Action"],
                    excludeSubtypes: ["Attack"],
                  },
                },
              },
              amount: {
                op: "gte",
                value: 1,
              },
            },
          },
          policy: {
            kind: "windowed",
            duration: "this-turn",
            matching: "first",
          },
          resolution: {
            kind: "effect",
            effect: {
              type: "modify-numeric",
              property: "defense",
              op: "subtract",
              amount: 1,
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "opponent",
                zones: ["combat-chain"],
                filter: {
                  typeBox: {
                    types: ["Action"],
                    excludeSubtypes: ["Attack"],
                  },
                  defending: true,
                },
                count: {
                  type: "all",
                },
              },
              duration: "this-chain-link",
            },
          },
        },
      },
    },
  },
});
