import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const mementoPocketwatch: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "f0jbv5n196",
  slug: "memento-pocketwatch",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "f0jbv5n196:face:default",
      catalogId: "f0jbv5n196",
      name: "Memento Pocketwatch",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC", "GUARDIAN"],
        subtypes: ["CLERIC", "GUARDIAN", "ARTIFACT"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "[Alice Bonus] This card costs 1 less to materialize.\n\n[Ciel Bonus] This card costs 1 less to materialize.\n\nOn Charge 3: Banish Memento Pocketwatch and draw a card. The next attack you declare with a unit this turn gets +3POWER. (At the beginning of your recollection phase, put a charge counter on each object you control with an untriggered on charge ability. Trigger this ability the first time three charge counters are on it.)",
      abilities: [
        {
          id: "f0jbv5n196-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Alice Bonus] This card costs 1 less to materialize.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Alice",
              },
            },
          ],
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "materialize",
              subject: {
                kind: "source",
              },
              costKind: "memory",
              costOperation: "subtract",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "f0jbv5n196-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Ciel Bonus] This card costs 1 less to materialize.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Ciel",
              },
            },
          ],
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "materialize",
              subject: {
                kind: "source",
              },
              costKind: "memory",
              costOperation: "subtract",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "f0jbv5n196-a3",
          kind: "triggered",
          text: "On Charge 3: Banish Memento Pocketwatch and draw a card. The next attack you declare with a unit this turn gets +3POWER. (At the beginning of your recollection phase, put a charge counter on each object you control with an untriggered on charge ability. Trigger this ability the first time three charge counters are on it.)",
          label: {
            name: "On Charge",
            parameters: {
              threshold: 3,
            },
          },
          trigger: {
            kind: "event",
            event: {
              name: "counter-added",
              subject: {
                kind: "source",
              },
              counter: {
                named: "charge",
              },
            },
          },
          limit: {
            count: 1,
            per: "source-instance",
          },
          interveningCondition: {
            kind: "has-counter",
            subject: {
              kind: "source",
            },
            counter: {
              named: "charge",
            },
            comparison: {
              left: {
                kind: "counter-count",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "charge",
                },
              },
              operator: "gte",
              right: 3,
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "sequence",
                effects: [
                  {
                    kind: "banish-object",
                    subject: {
                      kind: "source",
                    },
                  },
                  {
                    kind: "draw",
                    player: "controller",
                    amount: 1,
                  },
                ],
              },
              {
                kind: "create-delayed-trigger",
                trigger: {
                  kind: "event",
                  event: {
                    name: "attack-declared",
                    actor: "controller",
                    subject: {
                      kind: "event-object",
                      controller: "controller",
                      filter: {
                        kind: "type",
                        oneOf: ["ALLY", "CHAMPION"],
                      },
                    },
                  },
                },
                limit: 1,
                expires: {
                  kind: "this-turn",
                },
                effect: {
                  kind: "continuous",
                  subjects: {
                    kind: "current-attack",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "this-attack",
                  },
                  layer: {
                    layer: "E",
                    modifies: "stat",
                    sublayer: "modifier",
                  },
                  change: {
                    kind: "numeric",
                    property: "power",
                    operation: "add",
                    amount: 3,
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default mementoPocketwatch;
