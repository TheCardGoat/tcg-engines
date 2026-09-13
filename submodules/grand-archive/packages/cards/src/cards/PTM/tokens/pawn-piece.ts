import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const pawnPiece: GrandArchiveCard<GrandArchiveAbilityDefinition, "token-representation"> = {
  canonicalId: "Rpr6yCQKU6",
  slug: "pawn-piece",
  definitionKind: "token-representation",
  layout: {
    kind: "single-faced",
    face: {
      id: "Rpr6yCQKU6:face:default",
      catalogId: "Rpr6yCQKU6",
      name: "Pawn Piece",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "CHESSMAN", "PAWN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 0,
        life: 2,
      },
      rulesText:
        "[Alice Bonus] Commanded Will 1 (As long as this unit is attacking using a Command card, it gets +1POWER.)\n\n[Alice Bonus] On Hit: If 7 or more damage was dealt, you may sacrifice Pawn Piece. If you do, summon a Queen Piece token.",
      abilities: [
        {
          id: "Rpr6yCQKU6-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Alice Bonus] Commanded Will 1 (As long as this unit is attacking using a Command card, it gets +1POWER.)",
          keyword: {
            name: "commanded-will",
            value: 1,
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
        },
        {
          id: "Rpr6yCQKU6-a2",
          kind: "triggered",
          text: "[Alice Bonus] On Hit: If 7 or more damage was dealt, you may sacrifice Pawn Piece. If you do, summon a Queen Piece token.",
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

export default pawnPiece;
