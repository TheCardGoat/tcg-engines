import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/allies/aegis-archangel-of-protection.generated.ts";
import { ward } from "../shared/keywords.ts";

export const aegisArchangelOfProtection = defineCard(
  fabCardIdentitiesByCanonicalId.KtgRgFrrFDpzMQDJLLMwt,
  {
    keywords: [ward(4)],
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
          amount: 2,
        },
        effect: {
          type: "attack-with",
          target: {
            selector: "self",
          },
        },
      },
      createSpectralShieldsOnAttack: {
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
                name: "Aegis, Archangel of Protection",
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
                zones: ["soul"],
                count: 1,
              },
            },
            then: {
              type: "create-token",
              token: "spectral-shield",
              controller: "controller",
              count: 2,
            },
          },
        },
      },
    },
  },
);
