import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/jubeel-spellbane.generated.ts";

export const jubeelSpellbane = defineCard(fabCardIdentitiesByCanonicalId["kfCPfkdm8jrFqmHMNGj8h"], {
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
    wheneverHitsDontSpellbaneAegisCreateSpellbaneAegisToken: {
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
            kind: "source",
            selector: "attack",
          },
          target: {
            kind: "hero",
          },
        },
        state: {
          // "Spellbane Aegis" is the token's name, not subtypes; the parser
          // mis-categorised the printed text.  Match by card name.
          type: "not",
          condition: {
            type: "control-object",
            filter: {
              name: "Spellbane Aegis",
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "spellbane-aegis",
          controller: "controller",
        },
      },
    },
  },
});
