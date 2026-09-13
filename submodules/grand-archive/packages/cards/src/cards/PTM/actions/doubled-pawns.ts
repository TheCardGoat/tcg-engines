import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const doubledPawns: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "OQVvVANhJh",
  slug: "doubled-pawns",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "OQVvVANhJh:face:default",
      catalogId: "OQVvVANhJh",
      name: "Doubled Pawns",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "CHESSMAN", "SKILL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "Summon two Pawn Piece tokens.\n\n[Alice Bonus] If Doubled Pawns was activated during an opponent's recollection phase, those tokens also gain taunt until end of turn.",
      abilities: [
        {
          id: "OQVvVANhJh-a1",
          kind: "card-resolution",
          text: "Summon two Pawn Piece tokens.",
          effect: {
            kind: "summon",
            object: "Pawn Piece",
            controller: "controller",
            bindResultAs: "summoned-token",
            amount: 2,
          },
        },
        {
          id: "OQVvVANhJh-a2",
          kind: "ability-modifier",
          text: "[Alice Bonus] If Doubled Pawns was activated during an opponent's recollection phase, those tokens also gain taunt until end of turn.",
          modifies: {
            kind: "preceding-non-modifier-ability",
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
          operation: {
            kind: "append-effect",
            effect: {
              kind: "conditional",
              condition: {
                kind: "all",
                conditions: [
                  {
                    kind: "source-activation-context",
                    phase: "recollection",
                  },
                  {
                    kind: "turn-player",
                    player: "opponent",
                  },
                ],
              },
              then: {
                kind: "continuous",
                subjects: {
                  kind: "bound",
                  binding: "summoned-token",
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
                    name: "taunt",
                  },
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default doubledPawns;
