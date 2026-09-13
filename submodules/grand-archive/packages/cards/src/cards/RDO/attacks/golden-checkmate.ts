import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const goldenCheckmate: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "KbE9R1mi3n",
  slug: "golden-checkmate",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "KbE9R1mi3n:face:default",
      catalogId: "KbE9R1mi3n",
      name: "Golden Checkmate",
      cost: {
        kind: "reserve",
        amount: 15,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ULTIMATE", "CHESSMAN", "COMMAND"],
      },
      elements: ["EXALTED", "NORM"],
      stats: {
        power: 3,
      },
      rulesText:
        "Command Chessman\n\n[Alice Bonus] As long as you control a Pawn unit, this card costs 2 less to activate. The same is true for Rook, Knight, Bishop, Queen, and King units.\n\n[Alice Bonus] On Hit: At the beginning of your next recollection phase, you win the game.",
      abilities: [
        {
          id: "KbE9R1mi3n-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Command Chessman",
          keyword: {
            name: "command",
            subtype: "Chessman",
          },
        },
        {
          id: "KbE9R1mi3n-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Alice Bonus] As long as you control a Pawn unit, this card costs 2 less to activate. The same is true for Rook, Knight, Bishop, Queen, and King units.",
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
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "collection-exists",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "any",
                    filters: [
                      {
                        kind: "subtype",
                        oneOf: ["PAWN"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["ROOK"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["KNIGHT"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["BISHOP"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["QUEEN"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["KING"],
                      },
                    ],
                  },
                },
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
          id: "KbE9R1mi3n-a3",
          kind: "triggered",
          text: "[Alice Bonus] On Hit: At the beginning of your next recollection phase, you win the game.",
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
            kind: "create-delayed-trigger",
            trigger: {
              kind: "event",
              event: {
                name: "phase-begins",
                phase: "recollection",
                actor: "controller",
              },
            },
            effect: {
              kind: "win-game",
              player: "controller",
            },
          },
        },
      ],
    },
  },
};

export default goldenCheckmate;
