import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/blunt-retort.generated.ts";

export const bluntRetort = defineCard(fabCardIdentitiesByCanonicalId["qJ7GMMpjmGBpPKLHcnJc9"], {
  keywords: [bladeBreak],
  abilities: {
    whenDefendsWeaponAttackMayRemove1CounterFrom: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "defender" },
          defendedAttack: { typeBox: { types: ["Weapon"] } },
          bindDefendedAttackAs: "it",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "remove-counters",
            counter: { kind: "numeric", value: 1, property: "power" },
            count: 1,
            target: { selector: "binding", binding: "it" },
          },
        },
      },
    },
  },
});
