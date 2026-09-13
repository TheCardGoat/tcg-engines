import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/symbiosis-shot.generated.ts";

export const symbiosisShot = defineCard(fabCardIdentitiesByCanonicalId["tPW6ffbwKnNCWf9hKLKTN"], {
  keywords: [
    {
      name: "specialization",
      hero: "Dash",
    },
  ],
  abilities: {
    actionRemoveSteamCounterAttack: {
      kind: "activated",
      abilityType: "attack",
      cost: {
        class: "effect",
        type: "remove-counters",
        counter: {
          kind: "named",
          name: "steam",
        },
        count: 1,
      },
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
    wheneverMechanologistItemEntersArenaFewerThan6SteamCountersPutSteamCounter: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "enter-arena",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "moved-object",
            relationship: {
              kind: "any",
            },
            filter: {
              typeBox: {
                supertypes: ["Mechanologist"],
                subtypes: ["Item"],
              },
            },
            bindAs: "it",
          },
        },
        state: {
          type: "has-counter",
          counter: {
            kind: "named",
            name: "steam",
          },
          target: {
            selector: "self",
          },
          comparison: {
            op: "lt",
            value: 6,
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "add-counter",
            counter: {
              kind: "named",
              name: "steam",
            },
            count: 1,
            target: {
              selector: "self",
            },
          },
        },
      },
    },
  },
});
