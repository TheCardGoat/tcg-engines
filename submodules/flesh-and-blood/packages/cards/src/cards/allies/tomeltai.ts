import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/allies/tomeltai.generated.ts";

export const tomeltai = defineCard(fabCardIdentitiesByCanonicalId.JQqp6Ctw7QMLRDMgTnW6g, {
  abilities: {
    corrodeEquipmentOnAttack: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
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
              type: "reveal",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["deck"],
                position: "top",
                count: 2,
              },
            },
            {
              type: "conditional",
              condition: {
                type: "compare-amount",
                amount: {
                  type: "count",
                  what: "cards-revealed-this-way",
                  filter: {
                    color: ["red"],
                  },
                },
                comparison: { op: "gte", value: 1 },
              },
              then: {
                type: "add-counter",
                counter: {
                  kind: "numeric",
                  value: -1,
                  property: "defense",
                },
                count: {
                  type: "count",
                  what: "cards-revealed-this-way",
                  filter: {
                    color: ["red"],
                  },
                },
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "attack-target",
                  zones: ["equipment-head", "equipment-chest", "equipment-arms", "equipment-legs"],
                  filter: {
                    typeBox: {
                      types: ["Equipment"],
                    },
                  },
                  count: 1,
                },
                outputBinding: "it",
              },
            },
            {
              type: "conditional",
              condition: {
                type: "binding-matches",
                binding: "it",
                filter: {
                  defense: {
                    op: "eq",
                    value: 0,
                  },
                },
              },
              then: {
                type: "destroy",
                target: {
                  selector: "binding",
                  binding: "it",
                },
              },
            },
          ],
        },
      },
    },
  },
});
