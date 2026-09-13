import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const goldenPawn: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Lewf9sfv9m",
  slug: "golden-pawn",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Lewf9sfv9m:face:default",
      catalogId: "Lewf9sfv9m",
      name: "Golden Pawn",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "CHESSMAN", "PAWN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 0,
        life: 1,
      },
      rulesText:
        "As long as you control another Chessman unit, Golden Pawn has taunt. \n\nOn Death: Draw a card.\n\n[Alice Bonus] On Hit: If 7 or more damage was dealt, you may sacrifice Golden Pawn. If you do, summon a Queen Piece token.\n",
      abilities: [
        {
          id: "Lewf9sfv9m-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as you control another Chessman unit, Golden Pawn has taunt.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
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
                        oneOf: ["ALLY", "CHAMPION"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["CHESSMAN"],
                      },
                    ],
                  },
                },
              },
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
                  name: "taunt",
                },
              },
            },
          ],
        },
        {
          id: "Lewf9sfv9m-a2",
          kind: "triggered",
          text: "On Death: Draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
        {
          id: "Lewf9sfv9m-a3",
          kind: "triggered",
          text: "[Alice Bonus] On Hit: If 7 or more damage was dealt, you may sacrifice Golden Pawn. If you do, summon a Queen Piece token.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
            },
          },
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
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "attempt",
                effect: {
                  kind: "conditional",
                  condition: {
                    kind: "compare",
                    comparison: {
                      left: {
                        kind: "event-amount",
                      },
                      operator: "gte",
                      right: 7,
                    },
                  },
                  then: {
                    kind: "optional",
                    player: "controller",
                    allOrNothing: true,
                    effect: {
                      kind: "sacrifice",
                      subject: {
                        kind: "source",
                      },
                    },
                  },
                },
                bindSucceededAs: "prior-effect-succeeded",
              },
              {
                kind: "conditional",
                condition: {
                  kind: "effect-succeeded",
                  binding: "prior-effect-succeeded",
                },
                then: {
                  kind: "summon",
                  object: "Queen Piece",
                  controller: "controller",
                  bindResultAs: "summoned-token",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default goldenPawn;
