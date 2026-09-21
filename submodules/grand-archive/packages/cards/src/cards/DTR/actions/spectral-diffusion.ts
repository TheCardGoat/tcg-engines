import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const spectralDiffusion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "lathqgiqgi",
  slug: "spectral-diffusion",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "lathqgiqgi:face:default",
      catalogId: "lathqgiqgi",
      name: "Spectral Diffusion",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPECTER", "SPELL", "REACTION"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "This card costs 1 less to activate for each of up to two ephemeral objects you control.\n\nYour champion and ephemeral objects you control gain spellshroud until end of turn. (Objects with spellshroud can’t be targeted by Spells.)",
      abilities: [
        {
          id: "lathqgiqgi-a1",
          kind: "static",
          staticKind: "effects",
          text: "This card costs 1 less to activate for each of up to two ephemeral objects you control.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: {
                kind: "calculate",
                operator: "multiply",
                operands: [
                  {
                    kind: "calculate",
                    operator: "minimum",
                    operands: [
                      {
                        kind: "count",
                        collection: {
                          zones: ["field"],
                          player: "controller",
                          filter: {
                            kind: "object-state",
                            state: "ephemeral",
                          },
                        },
                      },
                      2,
                    ],
                  },
                  1,
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "lathqgiqgi-a2",
          kind: "card-resolution",
          text: "Your champion and ephemeral objects you control gain spellshroud until end of turn. (Objects with spellshroud can’t be targeted by Spells.)",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "continuous",
                subjects: {
                  kind: "champion",
                  player: "controller",
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
              {
                kind: "continuous",
                subjects: {
                  kind: "each",
                  collection: {
                    zones: ["field"],
                    player: "controller",
                    filter: {
                      kind: "object-state",
                      state: "ephemeral",
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
                    name: "spellshroud",
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

export default spectralDiffusion;
