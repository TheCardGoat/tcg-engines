import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const virgilAlteredFuture: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "xdgpdcD33h",
  slug: "virgil-altered-future",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "xdgpdcD33h:face:default",
      catalogId: "xdgpdcD33h",
      name: "Virgil, Altered Future",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "DISCORP", "AUTOMATON"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "Fast Activation\n\n[Level 1+]Virgil gets +1POWER and +1LIFE for each of up to two Powercell items you control.\n\nProgram cards you activate cost 1 less to activate if their activation targets Virgil.",
      abilities: [
        {
          id: "xdgpdcD33h-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Fast Activation",
          keyword: {
            name: "fast-activation",
          },
        },
        {
          id: "xdgpdcD33h-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Level 1+]Virgil gets +1POWER and +1LIFE for each of up to two Powercell items you control.",
          restrictions: [
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 1,
                },
              },
            },
          ],
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
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
                amount: {
                  kind: "count",
                  collection: {
                    zones: ["field"],
                    player: "controller",
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "type",
                          oneOf: ["ITEM"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["POWERCELL"],
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "life",
                operation: "add",
                amount: {
                  kind: "count",
                  collection: {
                    zones: ["field"],
                    player: "controller",
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "type",
                          oneOf: ["ITEM"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["POWERCELL"],
                        },
                      ],
                    },
                  },
                },
              },
            },
          ],
        },
        {
          id: "xdgpdcD33h-a3",
          kind: "static",
          staticKind: "effects",
          text: "Program cards you activate cost 1 less to activate if their activation targets Virgil.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "player",
                player: "controller",
              },
              filter: {
                kind: "subtype",
                oneOf: ["PROGRAM"],
              },
              condition: {
                kind: "ability-targets-subject",
                ability: "current",
                subject: {
                  kind: "source",
                },
                quantifier: "any",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 1,
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

export default virgilAlteredFuture;
