import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const craggyFatestone: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "h8n1520m2d",
  slug: "craggy-fatestone",
  definitionKind: "card",
  layout: {
    kind: "double-faced",
    defaultFace: {
      id: "h8n1520m2d:face:default",
      catalogId: "h8n1520m2d",
      name: "Craggy Fatestone",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "FATESTONE"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Whenever an opponent materializes a card with memory cost 0, put a buff counter on Craggy Fatestone.\n\n[Guo Jia Bonus] REST: Transform Craggy Fatestone. Activate this ability only if there are two or more buff counters on Craggy Fatestone.\n",
      abilities: [
        {
          id: "h8n1520m2d-a1",
          kind: "triggered",
          text: "Whenever an opponent materializes a card with memory cost 0, put a buff counter on Craggy Fatestone.",
          trigger: {
            kind: "event",
            event: {
              name: "card-materialized",
              actor: "opponent",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "numeric",
                  comparison: {
                    left: {
                      kind: "property",
                      subject: {
                        kind: "candidate",
                      },
                      property: "memory-cost",
                      basis: "base",
                    },
                    operator: "eq",
                    right: 0,
                  },
                },
              },
            },
          },
          effect: {
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: "buff",
            amount: 1,
          },
        },
        {
          id: "h8n1520m2d-a2",
          kind: "activated",
          text: "[Guo Jia Bonus] REST: Transform Craggy Fatestone. Activate this ability only if there are two or more buff counters on Craggy Fatestone.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          condition: {
            kind: "compare",
            comparison: {
              left: {
                kind: "counter-count",
                subject: {
                  kind: "source",
                },
                counter: "buff",
              },
              operator: "gte",
              right: 2,
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Guo Jia",
              },
            },
          ],
          effect: {
            kind: "transform",
            subject: {
              kind: "source",
            },
          },
        },
      ],
    },
    flipFace: {
      id: "h8n1520m2d:face:flip",
      catalogId: "63zw4a01wf",
      name: "Obstinate Cragback",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "FATEBOUND", "PANGOLIN"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "Spellshroud (Units with spellshroud can’t be targeted by Spells.)\n\nYour opponents can't materialize cards with memory cost 0.",
      abilities: [
        {
          id: "63zw4a01wf-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Spellshroud (Units with spellshroud can’t be targeted by Spells.)",
          keyword: {
            name: "spellshroud",
          },
        },
        {
          id: "63zw4a01wf-a2",
          kind: "static",
          staticKind: "effects",
          text: "Your opponents can't materialize cards with memory cost 0.",
          effects: [
            {
              kind: "rule-modification",
              mode: "forbid",
              action: "materialize",
              subject: {
                kind: "player",
                player: "each-opponent",
              },
              filter: {
                kind: "numeric",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "candidate",
                    },
                    property: "memory-cost",
                    basis: "base",
                  },
                  operator: "eq",
                  right: 0,
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default craggyFatestone;
