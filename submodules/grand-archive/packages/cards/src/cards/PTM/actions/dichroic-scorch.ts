import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const dichroicScorch: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "TlhsnnRhGK",
  slug: "dichroic-scorch",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "TlhsnnRhGK:face:default",
      catalogId: "TlhsnnRhGK",
      name: "Dichroic Scorch",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "slow",
      stats: {},
      rulesText:
        "As an additional cost to activate this card, discard a fire element card.\n\nRemove all sheen counters from all units on the field. Then deal X damage to each unit except for your champion, where X is the amount of counters removed this way.",
      abilities: [
        {
          id: "TlhsnnRhGK-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to activate this card, discard a fire element card.",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "select-and-move",
                player: "controller",
                from: "hand",
                to: "graveyard",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                filter: {
                  kind: "element",
                  oneOf: ["FIRE"],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "TlhsnnRhGK-a2",
          kind: "card-resolution",
          text: "Remove all sheen counters from all units on the field. Then deal X damage to each unit except for your champion, where X is the amount of counters removed this way.",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "modified-ability-result-amount",
                metric: "counters-removed",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "remove-counter",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                counter: {
                  named: "sheen",
                },
                amount: {
                  kind: "all",
                },
                bindResultAs: "removed-counters",
              },
              {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "each",
                  collection: {
                    zones: ["field"],
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "type",
                          oneOf: ["ALLY", "CHAMPION"],
                        },
                        {
                          kind: "not-subject",
                          subject: {
                            kind: "champion",
                            player: "controller",
                          },
                        },
                      ],
                    },
                  },
                },
                amount: {
                  kind: "variable",
                  symbol: "X",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default dichroicScorch;
