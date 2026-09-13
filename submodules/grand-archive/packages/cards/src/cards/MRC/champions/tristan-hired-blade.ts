import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tristanHiredBlade: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "gt7lh9v221",
  slug: "tristan-hired-blade",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "gt7lh9v221:face:default",
      catalogId: "gt7lh9v221",
      name: "Tristan, Hired Blade",
      lineageName: "Tristan",
      cost: {
        kind: "memory",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 2,
        life: 22,
      },
      rulesText:
        "Tristan Lineage\n\nOn Enter: If Tristan has two or more preparation counters on her, draw a card. Then if Tristan has four or more preparation counters on her, draw an additional card.",
      abilities: [
        {
          id: "gt7lh9v221-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Tristan Lineage",
          keyword: {
            name: "lineage",
            lineageName: "Tristan",
          },
        },
        {
          id: "gt7lh9v221-a2",
          kind: "triggered",
          text: "On Enter: If Tristan has two or more preparation counters on her, draw a card. Then if Tristan has four or more preparation counters on her, draw an additional card.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "conditional",
                condition: {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "counter-count",
                      subject: {
                        kind: "source",
                      },
                      counter: "preparation",
                    },
                    operator: "gte",
                    right: 2,
                  },
                },
                then: {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "counter-count",
                      subject: {
                        kind: "source",
                      },
                      counter: "preparation",
                    },
                    operator: "gte",
                    right: 4,
                  },
                },
                then: {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default tristanHiredBlade;
