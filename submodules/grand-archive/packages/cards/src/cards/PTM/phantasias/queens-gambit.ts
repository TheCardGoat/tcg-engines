import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const queensGambit: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "NGAy4rNwUo",
  slug: "queens-gambit",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "NGAy4rNwUo:face:default",
      catalogId: "NGAy4rNwUo",
      name: "Queen's Gambit",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "CHESSMAN", "SPELL"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        'As an additional cost to activate this card, sacrifice a Chessman ally.\n\nOn Enter: Draw a card into your memory. If the sacrificed ally was a Queen, summon three Pawn Piece tokens.\n\n[Alice Bonus] Chessman allies you control have "On Enter: This ally gets +1 POWER until end of turn."',
      abilities: [
        {
          id: "NGAy4rNwUo-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to activate this card, sacrifice a Chessman ally.",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "select-and-sacrifice",
                player: "controller",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                bindResultAs: "sacrificed-object",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["CHESSMAN"],
                    },
                  ],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "NGAy4rNwUo-a2",
          kind: "triggered",
          text: "On Enter: Draw a card into your memory. If the sacrificed ally was a Queen, summon three Pawn Piece tokens.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 1,
                to: "memory",
              },
              {
                kind: "conditional",
                condition: {
                  kind: "subject-matches",
                  subject: {
                    kind: "bound",
                    binding: "sacrificed-object",
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
                        oneOf: ["QUEEN"],
                      },
                    ],
                  },
                },
                then: {
                  kind: "summon",
                  object: "Pawn Piece",
                  controller: "controller",
                  bindResultAs: "summoned-token",
                  amount: 3,
                },
              },
            ],
          },
        },
        {
          id: "NGAy4rNwUo-a3",
          kind: "static",
          staticKind: "effects",
          text: '[Alice Bonus] Chessman allies you control have "On Enter: This ally gets +1 POWER until end of turn."',
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Alice",
              },
            },
          ],
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
                        kind: "subtype",
                        oneOf: ["CHESSMAN"],
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
                kind: "grant-ability",
                ability: {
                  id: "granted-1jza8v9-a1",
                  kind: "triggered",
                  text: "On Enter: This ally gets +1 POWER until end of turn.",
                  trigger: {
                    kind: "event",
                    event: {
                      name: "object-entered-field",
                      subject: {
                        kind: "source",
                      },
                    },
                  },
                  effect: {
                    kind: "continuous",
                    subjects: {
                      kind: "source",
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
                      property: "power",
                      operation: "add",
                      amount: 1,
                    },
                  },
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default queensGambit;
