import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/tokens/blasmophet-the-soul-harvester.generated.ts";

export const blasmophetTheSoulHarvester = defineCard(
  fabCardIdentitiesByCanonicalId.qJ8HCWnpHbPRGRGpt86Cb,
  {
    abilities: {
      attack: {
        kind: "activated",
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "attack",
        cost: {
          class: "asset",
          type: "resources",
          amount: 0,
        },
        effect: {
          type: "attack-with",
          target: {
            selector: "self",
          },
        },
      },
      banishSoulCardOnAttack: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "attack",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "event-object",
              selector: "attack",
              relationship: {
                kind: "any",
              },
              filter: {
                name: "Blasmophet, the Soul Harvester",
              },
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "optional",
            effect: {
              type: "banish",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["hand"],
                filter: {
                  typeBox: {
                    supertypes: ["Shadow"],
                  },
                },
                count: 1,
              },
            },
            then: {
              type: "optional",
              effect: {
                type: "banish",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "defending-hero",
                  zones: ["soul"],
                  count: 1,
                },
              },
            },
          },
        },
      },
    },
  },
);
