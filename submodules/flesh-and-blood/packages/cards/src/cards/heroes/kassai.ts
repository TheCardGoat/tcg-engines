import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/kassai.generated.ts";

export const kassai = defineCard(fabCardIdentitiesByCanonicalId["GwMRRqcL8rDHFRDTfqWzt"], {
  abilities: {
    drawnTurnSwordAttacksCostResourceLessActivate: {
      kind: "static",
      staticKind: "continuous",
      condition: { type: "performed-this-turn", event: "draw", player: "controller" },
      effect: {
        type: "modify-activation-cost",
        op: "subtract",
        amount: 1,
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["combat-chain", "hand", "weapon"],
          filter: {
            typeBox: {
              subtypes: ["Sword"],
            },
          },
          count: {
            type: "all",
          },
        },
        duration: "while-condition",
      },
    },
    oncePerTurnActionBanish2Red2YellowGraveyardNextTimeWeaponHitsTurnCreateGoldTokenGoAgain: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "action",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "effect",
            type: "banish",
            from: "graveyard",
            count: 2,
            filter: {
              color: ["red"],
            },
          },
          {
            class: "effect",
            type: "banish",
            from: "graveyard",
            count: 2,
            filter: {
              color: ["yellow"],
            },
          },
        ],
      },
      layerKeywords: [goAgain],
      effect: {
        type: "delayed-trigger",
        trigger: {
          kind: "event",
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
              filter: {
                typeBox: {
                  types: ["Weapon"],
                },
              },
              bindAs: "it",
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
            type: "create-token",
            token: "gold",
            controller: "controller",
          },
        },
      },
    },
  },
});
