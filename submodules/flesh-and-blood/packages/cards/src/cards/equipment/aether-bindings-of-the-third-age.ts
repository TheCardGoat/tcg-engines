import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/aether-bindings-of-the-third-age.generated.ts";

export const aetherBindingsOfTheThirdAge = defineCard(
  fabCardIdentitiesByCanonicalId["8rwTJkbzktjbhbQbPCKrc"],
  {
    keywords: [battleworn],
    abilities: {
      instantDestroyUntilEndTurnWheneverAuraPermanentControl: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        effect: {
          type: "delayed-trigger",
          trigger: {
            kind: "event",
            event: {
              name: "leave-arena",
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
                    subtypes: ["Aura"],
                  },
                  nameContains: "Sigil",
                },
              },
            },
          },
          policy: {
            kind: "windowed",
            duration: "this-turn",
            matching: "every",
          },
          resolution: {
            kind: "effect",
            effect: {
              type: "amp",
              amount: 1,
            },
          },
        },
      },
    },
  },
);
