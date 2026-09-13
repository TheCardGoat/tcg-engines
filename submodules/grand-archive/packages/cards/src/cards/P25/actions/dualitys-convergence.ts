import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const dualitysConvergence: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qtjphZSiO6",
  slug: "dualitys-convergence",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qtjphZSiO6:face:default",
      catalogId: "qtjphZSiO6",
      name: "Duality's Convergence",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SPELL"],
      },
      elements: ["CRUX"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Merlin Bonus] This card costs 2 less to activate.\n\nEach player summons a token copy of each non-Distortion regalia they control. Those copies each become a Distortion in addition to its other types.",
      abilities: [
        {
          id: "qtjphZSiO6-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Merlin Bonus] This card costs 2 less to activate.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Merlin",
              },
            },
          ],
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
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "qtjphZSiO6-a2",
          kind: "card-resolution",
          text: "Each player summons a token copy of each non-Distortion regalia they control. Those copies each become a Distortion in addition to its other types.",
          effect: {
            kind: "for-each-player",
            players: "each-player",
            bindEachAs: "copying-player",
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "summon-copies",
                  controller: {
                    binding: "copying-player",
                  },
                  subjects: {
                    kind: "each",
                    collection: {
                      zones: ["field"],
                      player: {
                        binding: "copying-player",
                      },
                      filter: {
                        kind: "all",
                        filters: [
                          {
                            kind: "supertype",
                            oneOf: ["REGALIA"],
                          },
                          {
                            kind: "not",
                            filter: {
                              kind: "subtype",
                              oneOf: ["DISTORTION"],
                            },
                          },
                        ],
                      },
                    },
                  },
                  token: true,
                  bindResultAs: "distortion-copies",
                },
                {
                  kind: "continuous",
                  subjects: {
                    kind: "bound",
                    binding: "distortion-copies",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "permanent",
                  },
                  layer: {
                    layer: "B",
                    modifies: "type",
                  },
                  change: {
                    kind: "add-characteristic",
                    characteristic: {
                      kind: "subtype",
                      value: "DISTORTION",
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default dualitysConvergence;
