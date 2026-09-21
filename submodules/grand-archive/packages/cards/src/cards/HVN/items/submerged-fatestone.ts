import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const submergedFatestone: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "zfb0pzm6qp",
  slug: "submerged-fatestone",
  definitionKind: "card",
  layout: {
    kind: "double-faced",
    defaultFace: {
      id: "zfb0pzm6qp:face:default",
      catalogId: "zfb0pzm6qp",
      name: "Submerged Fatestone",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "FATESTONE"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "Champions you don't control get -1 level.\n\n[Guo Jia Bonus] At the beginning of your recollection phase, you may banish a card with floating memory from your graveyard. If you do, transform Submerged Fatestone.",
      abilities: [
        {
          id: "zfb0pzm6qp-a1",
          kind: "static",
          staticKind: "effects",
          text: "Champions you don't control get -1 level.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "each-opponent",
                  filter: {
                    kind: "type",
                    oneOf: ["CHAMPION"],
                  },
                },
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
                property: "level",
                operation: "subtract",
                amount: 1,
              },
            },
          ],
        },
        {
          id: "zfb0pzm6qp-a2",
          kind: "triggered",
          text: "[Guo Jia Bonus] At the beginning of your recollection phase, you may banish a card with floating memory from your graveyard. If you do, transform Submerged Fatestone.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Guo Jia",
              },
            },
          ],
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "attempt",
                  effect: {
                    kind: "banish",
                    player: "controller",
                    selection: {
                      id: "banished-cards",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "controller",
                      count: {
                        kind: "exactly",
                        amount: 1,
                      },
                      candidates: {
                        kind: "card",
                        zones: ["graveyard"],
                        relationship: "zone-of",
                        player: "controller",
                        filter: {
                          kind: "has-keyword",
                          keyword: "floating-memory",
                        },
                      },
                    },
                  },
                  bindSucceededAs: "optional-action-succeeded",
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "effect-succeeded",
                    binding: "optional-action-succeeded",
                  },
                  then: {
                    kind: "transform",
                    subject: {
                      kind: "source",
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    },
    flipFace: {
      id: "zfb0pzm6qp:face:flip",
      catalogId: "l5nqwq5ujh",
      name: "Commanding Sea Titan",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "FATEBOUND", "WHALE"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 5,
      },
      rulesText:
        "Champions you don't control get -1 level.\n\nTaunt (While awake, this ally must be targeted before other units you control during your opponents' attack declarations if able.)",
      abilities: [
        {
          id: "l5nqwq5ujh-a1",
          kind: "static",
          staticKind: "effects",
          text: "Champions you don't control get -1 level.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "each-opponent",
                  filter: {
                    kind: "type",
                    oneOf: ["CHAMPION"],
                  },
                },
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
                property: "level",
                operation: "subtract",
                amount: 1,
              },
            },
          ],
        },
        {
          id: "l5nqwq5ujh-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Taunt (While awake, this ally must be targeted before other units you control during your opponents' attack declarations if able.)",
          keyword: {
            name: "taunt",
          },
        },
      ],
    },
  },
};

export default submergedFatestone;
