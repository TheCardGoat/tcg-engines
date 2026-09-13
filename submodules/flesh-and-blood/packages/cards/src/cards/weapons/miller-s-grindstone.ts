import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/miller-s-grindstone.generated.ts";

export const millerSGrindstone = defineCard(
  fabCardIdentitiesByCanonicalId["RRfwzgrbMbFGNqppnD8rB"],
  {
    abilities: {
      oncePerTurnActionResourceResourceResourceAttack: {
        kind: "activated",
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "attack",
        cost: {
          class: "asset",
          type: "resources",
          amount: 3,
        },
        effect: {
          type: "attack-with",
          target: {
            selector: "self",
          },
        },
        label: {
          name: "clash",
        },
      },
      hitsClashWinDestroyTopDeckWinPut1PowerCounter: {
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
                type: "clash",
                with: {
                  selector: "attack-target",
                },
              },
              {
                type: "conditional",
                condition: {
                  type: "has-status",
                  status: "won-clash",
                },
                then: {
                  type: "destroy",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "attack-target",
                    zones: ["deck"],
                    position: "top",
                    count: 1,
                  },
                },
              },
              {
                type: "conditional",
                condition: {
                  type: "has-status",
                  status: "opponent-won-clash",
                },
                then: {
                  type: "add-counter",
                  counter: {
                    kind: "numeric",
                    value: -1,
                    property: "power",
                  },
                  count: 1,
                  target: {
                    selector: "self",
                  },
                },
              },
            ],
          },
        },
        label: {
          name: "clash",
        },
      },
    },
  },
);
