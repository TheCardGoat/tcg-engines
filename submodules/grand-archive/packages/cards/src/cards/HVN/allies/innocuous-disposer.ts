import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const innocuousDisposer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "pd2aigr677",
  slug: "innocuous-disposer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "pd2aigr677:face:default",
      catalogId: "pd2aigr677",
      name: "Innocuous Disposer",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText:
        "Innocuous Disposer's attacks can't be retaliated by Human allies.\n\n[Class Bonus] On Ally Hit: If the hit ally is a Human, you may remove a preparation counter from your champion. If you do, destroy the hit ally.",
      abilities: [
        {
          id: "pd2aigr677-a1",
          kind: "static",
          staticKind: "effects",
          text: "Innocuous Disposer's attacks can't be retaliated by Human allies.",
          effects: [
            {
              kind: "rule-modification",
              mode: "forbid",
              action: "retaliate",
              subject: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["HUMAN"],
                      },
                    ],
                  },
                },
              },
              against: {
                kind: "source",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "pd2aigr677-a2",
          kind: "triggered",
          text: "[Class Bonus] On Ally Hit: If the hit ally is a Human, you may remove a preparation counter from your champion. If you do, destroy the hit ally.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
              recipient: {
                kind: "event-object",
                bindAs: "trigger-recipient",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "attempt",
                effect: {
                  kind: "conditional",
                  condition: {
                    kind: "subject-matches",
                    subject: {
                      kind: "event-recipient",
                    },
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "type",
                          oneOf: ["ALLY"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["HUMAN"],
                        },
                      ],
                    },
                  },
                  then: {
                    kind: "optional",
                    player: "controller",
                    allOrNothing: true,
                    effect: {
                      kind: "remove-counter",
                      subject: {
                        kind: "champion",
                        player: "controller",
                      },
                      counter: "preparation",
                      amount: 1,
                      bindResultAs: "removed-counters",
                    },
                  },
                },
                bindSucceededAs: "prior-effect-succeeded",
              },
              {
                kind: "conditional",
                condition: {
                  kind: "effect-succeeded",
                  binding: "prior-effect-succeeded",
                },
                then: {
                  kind: "destroy",
                  subject: {
                    kind: "event-recipient",
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

export default innocuousDisposer;
