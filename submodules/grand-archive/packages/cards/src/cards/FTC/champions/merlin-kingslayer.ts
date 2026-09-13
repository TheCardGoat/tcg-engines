import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const merlinKingslayer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "rz1bqry41l",
  slug: "merlin-kingslayer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "rz1bqry41l:face:default",
      catalogId: "rz1bqry41l",
      name: "Merlin, Kingslayer",
      lineageName: "Merlin",
      cost: {
        kind: "memory",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["MAGE", "WARRIOR"],
        subtypes: ["MAGE", "WARRIOR", "HUMAN"],
      },
      elements: ["CRUX"],
      stats: {
        level: 3,
        life: 28,
      },
      rulesText:
        "Merlin Lineage\n\nAt the beginning of your recollection phase, put a level counter on Merlin. Then, if there's an even amount of level counters on Merlin, draw a card and Merlin's attacks get +2 POWER until end of turn.",
      abilities: [
        {
          id: "rz1bqry41l-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Merlin Lineage",
          keyword: {
            name: "lineage",
            lineageName: "Merlin",
          },
        },
        {
          id: "rz1bqry41l-a2",
          kind: "triggered",
          text: "At the beginning of your recollection phase, put a level counter on Merlin. Then, if there's an even amount of level counters on Merlin, draw a card and Merlin's attacks get +2 POWER until end of turn.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "add-counter",
                subject: {
                  kind: "source",
                },
                counter: "level",
                amount: 1,
              },
              {
                kind: "conditional",
                condition: {
                  kind: "counter-count-parity",
                  subject: {
                    kind: "source",
                  },
                  counter: "level",
                  value: "even",
                },
                then: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "draw",
                      player: "controller",
                      amount: 1,
                    },
                    {
                      kind: "continuous",
                      subjects: {
                        kind: "attacks-by",
                        attacker: {
                          kind: "source",
                        },
                      },
                      affectedSet: "dynamic",
                      duration: {
                        kind: "this-turn",
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
                        amount: 2,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default merlinKingslayer;
