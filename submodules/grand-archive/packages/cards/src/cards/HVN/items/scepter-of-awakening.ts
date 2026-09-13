import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const scepterOfAwakening: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "2zh208013h",
  slug: "scepter-of-awakening",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "2zh208013h:face:default",
      catalogId: "2zh208013h",
      name: "Scepter of Awakening",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SCEPTER"],
      },
      elements: ["TERA"],
      stats: {},
      rulesText:
        "[Diao Chan Bonus] As long as you control four or more phantasias, you may activate this card from your material deck.\n\n(2), REST: Target phantasia you control becomes an ally in addition to its other types with base power and life equal to its reserve cost until end of turn. Put a buff counter on it.",
      abilities: [
        {
          id: "2zh208013h-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Diao Chan Bonus] As long as you control four or more phantasias, you may activate this card from your material deck.",
          functionalZones: ["material-deck"],
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Diao Chan",
              },
            },
          ],
          effects: [
            {
              kind: "rule-modification",
              mode: "allow",
              action: "activate",
              subject: {
                kind: "source",
              },
              fromZone: "material-deck",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "count",
                    collection: {
                      zones: ["field"],
                      player: "controller",
                      filter: {
                        kind: "type",
                        oneOf: ["PHANTASIA"],
                      },
                    },
                  },
                  operator: "gte",
                  right: 4,
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "2zh208013h-a2",
          kind: "activated",
          text: "(2), REST: Target phantasia you control becomes an ally in addition to its other types with base power and life equal to its reserve cost until end of turn. Put a buff counter on it.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          targets: [
            {
              id: "target-phantasia",
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
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["PHANTASIA"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "continuous",
                subjects: {
                  kind: "bound",
                  binding: "target-phantasia",
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-turn",
                },
                layer: {
                  layer: "B",
                  modifies: "type",
                },
                change: {
                  kind: "add-characteristic",
                  characteristic: {
                    kind: "type",
                    value: "ALLY",
                  },
                },
              },
              {
                kind: "continuous",
                subjects: {
                  kind: "bound",
                  binding: "target-phantasia",
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-turn",
                },
                layer: {
                  layer: "A",
                  modifies: "base-stats",
                },
                change: {
                  kind: "numeric",
                  property: "power",
                  operation: "set",
                  amount: {
                    kind: "property",
                    subject: {
                      kind: "bound",
                      binding: "target-phantasia",
                    },
                    property: "reserve-cost",
                    basis: "base",
                  },
                },
              },
              {
                kind: "continuous",
                subjects: {
                  kind: "bound",
                  binding: "target-phantasia",
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-turn",
                },
                layer: {
                  layer: "A",
                  modifies: "base-stats",
                },
                change: {
                  kind: "numeric",
                  property: "life",
                  operation: "set",
                  amount: {
                    kind: "property",
                    subject: {
                      kind: "bound",
                      binding: "target-phantasia",
                    },
                    property: "reserve-cost",
                    basis: "base",
                  },
                },
              },
              {
                kind: "add-counter",
                subject: {
                  kind: "bound",
                  binding: "target-phantasia",
                },
                counter: "buff",
                amount: 1,
              },
            ],
          },
        },
      ],
    },
  },
};

export default scepterOfAwakening;
