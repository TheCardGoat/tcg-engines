import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/uzuri.generated.ts";

export const uzuri = defineCard(fabCardIdentitiesByCanonicalId["QmqN6fJJMnLDjLHKF7g97"], {
  abilities: {
    oncePerTurnAttackReactionBanishHandFaceDownTurnBanishedWayFaceUpAttackActionCost2LessPutTargetAttackingStealthActiveChainLinkBottomOwnersDeckThenPutBanishedOntoActiveChainLinkAttacking:
      {
        kind: "activated",
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "attack-reaction",
        cost: {
          class: "effect",
          type: "banish",
          from: "hand",
          count: 1,
          faceDown: true,
          outputBinding: "it",
        },
        effect: {
          type: "sequence",
          steps: [
            {
              type: "turn-face-up",
              target: {
                selector: "binding",
                binding: "it",
              },
            },
            {
              type: "conditional",
              condition: {
                type: "binding-matches",
                binding: "it",
                filter: attackActionFilter({ cost: { op: "lte", value: 2 } }),
              },
              // Both the deck-bottom of the stealth attacker and the put-as-attacking
              // of the revealed card are gated by the cost≤2 attack-action check.
              then: {
                type: "sequence",
                steps: [
                  {
                    type: "move-card",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "controller",
                      zones: ["combat-chain"],
                      filter: {
                        hasKeyword: "stealth",
                        hasStatus: "attacking",
                      },
                      count: 1,
                    },
                    to: {
                      zone: "deck",
                      position: "bottom",
                    },
                  },
                  {
                    type: "move-card",
                    target: {
                      selector: "binding",
                      binding: "it",
                    },
                    to: {
                      zone: "combat-chain",
                      asAttacking: true,
                    },
                  },
                ],
              },
            },
          ],
        },
      },
  },
});
