import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/spider-s-bite.generated.ts";
import { goAgain, piercing } from "../shared/keywords.ts";

export const spiderSBite = defineCard(fabCardIdentitiesByCanonicalId["hDzHTgkgGfqFCn8mmR9M6"], {
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
    hitsNextTimeDefend1MoreAttackActionTurn1DefenseDefending: {
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
                filter: attackActionFilter(),
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
                filter: attackActionFilter({ defending: true }),
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
