import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const changbanHeroicImpasse: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "kmuuqzfvg8",
  slug: "changban-heroic-impasse",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "kmuuqzfvg8:face:default",
      catalogId: "kmuuqzfvg8",
      name: "Changban, Heroic Impasse",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["DOMAIN"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "CROSSROADS"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "On Enter: Put a buff counter on a unique ally you control.\n\nAllies you control with one or more buff counters on them have ambush.\n\nUpkeep — At the beginning of your recollection phase, if you don't control a unique ally, sacrifice Changban.",
      abilities: [
        {
          id: "kmuuqzfvg8-a1",
          kind: "triggered",
          text: "On Enter: Put a buff counter on a unique ally you control.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
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
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "supertype",
                      oneOf: ["UNIQUE"],
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            counter: "buff",
            amount: 1,
          },
        },
        {
          id: "kmuuqzfvg8-a2",
          kind: "static",
          staticKind: "effects",
          text: "Allies you control with one or more buff counters on them have ambush.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "has-counter",
                        counter: "buff",
                      },
                    ],
                  },
                },
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "ambush",
                },
              },
            },
          ],
        },
        {
          id: "kmuuqzfvg8-a3",
          kind: "triggered",
          text: "Upkeep — At the beginning of your recollection phase, if you don't control a unique ally, sacrifice Changban.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "not",
              condition: {
                kind: "collection-exists",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "supertype",
                        oneOf: ["UNIQUE"],
                      },
                    ],
                  },
                },
              },
            },
            then: {
              kind: "sacrifice",
              subject: {
                kind: "source",
              },
            },
          },
          label: {
            name: "Upkeep",
          },
        },
      ],
    },
  },
};

export default changbanHeroicImpasse;
