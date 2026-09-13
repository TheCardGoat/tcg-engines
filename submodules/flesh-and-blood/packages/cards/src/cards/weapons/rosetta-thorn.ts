import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/rosetta-thorn.generated.ts";

export const rosettaThorn = defineCard(fabCardIdentitiesByCanonicalId["cbHrfwmLrMjWdhdBtzbff"], {
  abilities: {
    oncePerTurnActionResourceAttack: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "attack",
      cost: {
        class: "asset",
        type: "resources",
        amount: 1,
      },
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
    wheneverAttackRosettaThornPlayedAttackActionNonAttackActionTurnDeal2ArcaneDamageTarget: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
        },
        state: {
          type: "and",
          conditions: [
            {
              type: "played-this",
              per: "turn",
              filter: attackActionFilter(),
              comparison: { op: "gte", value: 1 },
            },
            {
              type: "played-this",
              per: "turn",
              filter: { typeBox: { types: ["Action"], excludeSubtypes: ["Attack"] } },
              comparison: { op: "gte", value: 1 },
            },
          ],
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "deal-damage",
          damageType: "arcane",
          amount: 2,
          target: {
            selector: "opponent",
          },
        },
      },
    },
  },
});
