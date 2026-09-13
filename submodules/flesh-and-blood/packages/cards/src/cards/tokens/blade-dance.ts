import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/tokens/blade-dance.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const bladeDance = defineCard(fabCardIdentitiesByCanonicalId.Gb8JgWdw6LbKBHhMkBw9D, {
  abilities: {
    grantGoAgainToWeaponAttack: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "activate",
          actor: { kind: "player", player: "ability-controller" },
          observes: {
            kind: "event-object",
            selector: "activated-card",
            relationship: { kind: "any" },
            filter: { typeBox: { types: ["Weapon"] } },
            bindAs: "it",
          },
          abilityType: "attack",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            { type: "destroy", target: { selector: "self" } },
            {
              type: "grant-property",
              property: { kind: "keyword", keyword: goAgain },
              target: { selector: "binding", binding: "it" },
              duration: "this-chain-link",
            },
          ],
        },
      },
    },
  },
});
