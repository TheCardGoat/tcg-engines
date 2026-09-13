import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/shriek-razors.generated.ts";

/**
 * EVO235 Shriek Razors — Assassin Arms d1 Battleworn.
 *
 * Printed:
 *   While this is in your graveyard, at the start of your turn, you may
 *   destroy 2 Silvers you control. If you do, equip this.
 *   Attack Reaction - {r}{r}, destroy this: Target attack action card
 *   defending an Assassin attack gets -1{d}.
 *   Battleworn
 *
 * Model notes (hand-authored; case-by-case):
 * - a1: graven-cowl/vestment path — functionalZones:["graveyard"] +
 *   in-your-graveyard; optional destroy 2 name:"Silver" then equip self.
 *   Prior subtypes:["Silvers"] never matches (Token+Item named Silver).
 * - a2: AR mixed 2{r}+destroy-self; on-stack defending AAC (types Action +
 *   subtypes Attack matching evaluated type-box) against Assassin attack;
 *   player:"any" so legalDecisionTargets scans opponent combatChain (default
 *   controller-only misses defending cards); −1{d} this combat chain.
 */
export const shriekRazors = defineCard(fabCardIdentitiesByCanonicalId["DjWkHNPRFf8JgdpzGd96L"], {
  keywords: [battleworn],
  abilities: {
    whileIsGraveyardAtStartTurnMayDestroy2: {
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
              // Silver tokens are Token Items named Silver (not a subtype).
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
    attackReactionDestroyTargetAttackActionDefendingAssassinAttack: {
      kind: "activated",
      abilityType: "attack-reaction",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 2,
          },
          {
            class: "effect",
            type: "destroy-self",
          },
        ],
      },
      effect: {
        type: "modify-numeric",
        property: "defense",
        op: "subtract",
        amount: 1,
        target: {
          selector: "object",
          declared: "on-stack",
          // Defending cards sit on the opponent's combatChain; legalDecisionTargets
          // defaults player:undefined → controller-only and misses them.
          player: "any",
          zones: ["combat-chain"],
          filter: attackActionFilter({
            defending: true,
            defendingAgainst: {
              typeBox: {
                supertypes: ["Assassin"],
              },
            },
          }),
          count: 1,
        },
        duration: "this-combat-chain",
        outputBinding: "it",
      },
    },
  },
});
