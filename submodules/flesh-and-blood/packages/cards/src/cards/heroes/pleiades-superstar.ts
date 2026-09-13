import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/pleiades-superstar.generated.ts";

export const pleiadesSuperstar = defineCard(
  fabCardIdentitiesByCanonicalId["JhgRJb6nfctWkndbzrgnj"],
  {
    abilities: {
      instantTapRemoveSuspenseCounterAuraPutSuspenseCounterAuraSuspense: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "mixed",
          type: "all",
          costs: [
            {
              class: "effect",
              type: "tap-self",
            },
            {
              class: "effect",
              type: "remove-counters",
              counter: {
                kind: "named",
                name: "suspense",
              },
              count: 1,
              filter: {
                typeBox: {
                  subtypes: ["Aura"],
                },
              },
            },
          ],
        },
        effect: {
          type: "optional",
          effect: {
            type: "add-counter",
            counter: {
              kind: "named",
              name: "suspense",
            },
            count: 1,
            target: {
              selector: "object",
              declared: "on-stack",
              player: "controller",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  subtypes: ["Aura"],
                },
                hasKeyword: "suspense",
              },
              count: 1,
            },
          },
        },
      },
      wheneverCrowdCheersCreateConfidenceToken: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "crowd-cheers",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "none",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "create-token",
            token: "confidence",
            controller: "controller",
          },
        },
      },
    },
  },
);
