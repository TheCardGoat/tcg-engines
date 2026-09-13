import { guardwell } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/starfield-veil.generated.ts";

export const starfieldVeil = defineCard(fabCardIdentitiesByCanonicalId["MkzmkbbNf7DMHkzMkDrLk"], {
  keywords: [guardwell],
  abilities: {
    instantDestroyNextAuraPlayTurnEntersArenaHolo: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      condition: { type: "performed-this-turn", event: "fragment-attack", player: "controller" },
      // "next aura you play this turn enters with a holo counter":
      // one-shot delayed enter-arena (not add-counter on this-attack +
      // subtypes:["Aura"] residue — that never latched).
      effect: {
        type: "delayed-trigger",
        trigger: {
          kind: "event",
          event: {
            name: "enter-arena",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "event-object",
              selector: "moved-object",
              relationship: {
                kind: "controller",
                player: "ability-controller",
              },
              filter: {
                typeBox: {
                  subtypes: ["Aura"],
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
            type: "add-counter",
            counter: {
              kind: "named",
              name: "holo",
            },
            count: 1,
            target: {
              selector: "binding",
              binding: "it",
            },
          },
        },
      },
    },
  },
});
