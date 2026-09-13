import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/scorpio-comet-tail.generated.ts";

export const scorpioCometTail = defineCard(
  fabCardIdentitiesByCanonicalId["cGDjfwq76gpNQpWDMtLt9"],
  {
    abilities: {
      actionTapAttackActivateOnlyLightningAttack: {
        kind: "activated",
        abilityType: "attack",
        cost: {
          class: "effect",
          type: "tap-self",
        },
        condition: {
          type: "control-object",
          filter: {
            typeBox: {
              supertypes: ["Lightning"],
              subtypes: ["Attack"],
            },
          },
        },
        effect: {
          type: "attack-with",
          target: {
            selector: "self",
          },
        },
      },
      hitsDeal1ArcaneDamage: {
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
            type: "deal-damage",
            damageType: "arcane",
            amount: 1,
            target: {
              selector: "attack-target",
            },
          },
        },
      },
    },
  },
);
