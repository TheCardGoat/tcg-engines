import { attackActionFilter, compareAmount } from "@tcg/flesh-and-blood-types";
import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/mask-of-momentum.generated.ts";

export const maskOfMomentum = defineCard(fabCardIdentitiesByCanonicalId["GrB8WmQjkqnGJhDBwKQtn"], {
  keywords: [bladeBreak],
  abilities: {
    oncePerTurnEffectWhenAttackActionControlIs: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "hit",
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
            filter: attackActionFilter(),
          },
        },
        state: compareAmount(
          { type: "count", what: "consecutive-chain-links-that-hit" },
          { op: "gte", value: 3 },
        ),
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "draw",
          count: 1,
          player: "controller",
        },
      },
      limit: {
        count: 1,
        per: "turn",
      },
    },
  },
});
