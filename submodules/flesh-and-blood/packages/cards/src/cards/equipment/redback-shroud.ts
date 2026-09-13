import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/redback-shroud.generated.ts";

/**
 * OUT011 Redback Shroud — Assassin Chest d1 Battleworn.
 *
 * Printed:
 *   While Redback Shroud is in your graveyard, at the start of your turn, you
 *   may destroy 2 Silver you control. If you do, equip Redback Shroud.
 *   Attack Reaction - Destroy Redback Shroud: The next attack reaction card
 *   you play this turn costs {r} less to play.
 *   Battleworn
 *
 * Model notes (hand-authored; graven-cowl / silken-gi family):
 * - a1 GY-static: functionalZones graveyard; name:Silver (not subtypes);
 *   equip selector self (not name search into inventory).
 * - a2 next AR cost −1 uses types:["Attack Reaction"] — and[subtypes Attack,
 *   subtypes Reaction] never matches (Reaction is not a subtype of AAC).
 */
export const redbackShroud = defineCard(fabCardIdentitiesByCanonicalId["7PtLHnBmRQffFP9ghNpJG"], {
  keywords: [battleworn],
  abilities: {
    whileRedbackShroudIsGraveyardAtStartTurnMay: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "start-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
        state: {
          type: "has-status",
          status: "in-your-graveyard",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "destroy",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["permanent"],
              // Silver tokens are named Silver (not a subtype vocabulary entry).
              filter: {
                name: "Silver",
              },
              count: 2,
            },
          },
          then: {
            type: "equip",
            target: {
              selector: "self",
            },
          },
        },
      },
      functionalZones: ["graveyard"],
    },
    attackReactionDestroyRedbackShroudNextAttackReactionPlay: {
      kind: "activated",
      abilityType: "attack-reaction",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      effect: {
        type: "modify-numeric",
        property: "cost",
        op: "subtract",
        amount: 1,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              types: ["Attack Reaction"],
            },
          },
        },
      },
    },
  },
});
