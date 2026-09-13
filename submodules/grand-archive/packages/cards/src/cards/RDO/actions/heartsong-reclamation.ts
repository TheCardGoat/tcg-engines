import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const heartsongReclamation: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "d253WtyIXr",
  slug: "heartsong-reclamation",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "d253WtyIXr:face:default",
      catalogId: "d253WtyIXr",
      name: "Heartsong Reclamation",
      cost: {
        kind: "reserve",
        amount: 8,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ULTIMATE", "SPELL", "MELODY"],
      },
      elements: ["TERA"],
      speed: "slow",
      stats: {},
      rulesText:
        "Destroy all regalia you don't control. Until end of turn, Animal and/or Beast allies you control gain cleave.  \n\n[Silvie Bonus] Put five buff counters on each Animal and/or Beast ally you control.",
      abilities: [
        {
          id: "d253WtyIXr-a1",
          kind: "card-resolution",
          text: "Destroy all regalia you don't control. Until end of turn, Animal and/or Beast allies you control gain cleave.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "destroy",
                subject: {
                  kind: "each",
                  collection: {
                    zones: ["field"],
                    player: "each-opponent",
                    filter: {
                      kind: "supertype",
                      oneOf: ["REGALIA"],
                    },
                  },
                },
              },
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
                    name: "cleave",
                  },
                },
              },
            ],
          },
        },
        {
          id: "d253WtyIXr-a2",
          kind: "card-resolution",
          text: "[Silvie Bonus] Put five buff counters on each Animal and/or Beast ally you control.",
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
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Silvie",
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
            amount: 5,
          },
        },
      ],
    },
  },
};

export default heartsongReclamation;
