import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const anthemOfVitality: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vbgl6ffqsu",
  slug: "anthem-of-vitality",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vbgl6ffqsu:face:default",
      catalogId: "vbgl6ffqsu",
      name: "Anthem of Vitality",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SKILL", "HARMONY"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "Target Animal or Beast ally gets +3 LIFE and gains spellshroud until end of turn.\n\nHarmonize — If you've activated a Melody card this turn, put two buff counters on an Animal or Beast ally you control.",
      abilities: [
        {
          id: "vbgl6ffqsu-a1",
          kind: "card-resolution",
          text: "Target Animal or Beast ally gets +3 LIFE and gains spellshroud until end of turn.",
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
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "any",
                      filters: [
                        {
                          kind: "subtype",
                          oneOf: ["ANIMAL"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["BEAST"],
                        },
                      ],
                    },
                  ],
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
                  binding: "target-1",
                },
                affectedSet: "locked",
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
                  property: "life",
                  operation: "add",
                  amount: 3,
                },
              },
              {
                kind: "continuous",
                subjects: {
                  kind: "bound",
                  binding: "target-1",
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-turn",
                },
                layer: {
                  layer: "D",
                  modifies: "ability",
                },
                change: {
                  kind: "grant-keyword",
                  keyword: {
                    name: "spellshroud",
                  },
                },
              },
            ],
          },
        },
        {
          id: "vbgl6ffqsu-a2",
          kind: "card-resolution",
          text: "Harmonize — If you've activated a Melody card this turn, put two buff counters on an Animal or Beast ally you control.",
          targets: [
            {
              id: "vbgl6ffqsu-a2:target-1",
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
                      kind: "any",
                      filters: [
                        {
                          kind: "subtype",
                          oneOf: ["ANIMAL"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["BEAST"],
                        },
                      ],
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "conditional",
            condition: {
              kind: "history",
              event: "card-activated",
              window: "this-turn",
              actor: "controller",
              filter: {
                kind: "subtype",
                oneOf: ["MELODY"],
              },
              minimum: 1,
            },
            then: {
              kind: "add-counter",
              subject: {
                kind: "bound",
                binding: "vbgl6ffqsu-a2:target-1",
              },
              counter: "buff",
              amount: 2,
            },
          },
          label: {
            name: "Harmonize",
          },
        },
      ],
    },
  },
};

export default anthemOfVitality;
