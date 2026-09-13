import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/boltyn.generated.ts";

export const boltyn = defineCard(fabCardIdentitiesByCanonicalId["Fmf8trg9w8B8BBbWrf8w9"], {
  abilities: {
    chargedTurnAttacksGet1PowerDefendedAttackAction: {
      kind: "static",
      staticKind: "continuous",
      condition: { type: "performed-this-turn", event: "charge", player: "controller" },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["combat-chain"],
          filter: {
            typeBox: {
              subtypes: ["Attack"],
            },
            hasStatus: "defended-by-attack-action",
          },
          count: {
            type: "all",
          },
        },
        duration: "while-in-arena",
      },
    },
    attackReactionBanishBoltynsSoulTargetAttackPowerGreaterThanBasePowerGainsGoAgain: {
      kind: "activated",
      abilityType: "attack-reaction",
      cost: {
        class: "effect",
        type: "banish",
        from: "soul",
        count: 1,
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
        },
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: {
            and: [{ hasStatus: "attacking" }, { hasStatus: "power-greater-than-base" }],
          },
          count: 1,
        },
        duration: "this-turn",
        outputBinding: "it",
      },
    },
  },
});
