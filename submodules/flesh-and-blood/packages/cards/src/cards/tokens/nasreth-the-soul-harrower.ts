import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/tokens/nasreth-the-soul-harrower.generated.ts";

export const nasrethTheSoulHarrower = defineCard(
  fabCardIdentitiesByCanonicalId.GpmN8jcWjbH7fMHd7hWjJ,
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
      banishSoulAndGainLifeOnHit: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
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
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "banish",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "opponent",
                  zones: ["soul"],
                  count: 1,
                },
                outputBinding: "it",
              },
              {
                type: "conditional",
                condition: {
                  type: "binding-matches",
                  binding: "it",
                  filter: {
                    typeBox: {
                      supertypes: ["Light"],
                    },
                  },
                },
                then: {
                  type: "gain-life",
                  amount: 1,
                  target: {
                    selector: "controller",
                  },
                },
              },
            ],
          },
        },
      },
    },
  },
);
