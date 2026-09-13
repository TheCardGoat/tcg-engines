import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lagomorphPiece: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "JwgigfOaG8",
  slug: "lagomorph-piece",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "JwgigfOaG8:face:default",
      catalogId: "JwgigfOaG8",
      name: "Lagomorph Piece",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "CHESSMAN", "BAUBLE"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "[Alice Bonus] This card costs 1 less to materialize.\n\n(3), Banish Lagomorph Piece: Return target Chessman Command card from your graveyard to your memory.",
      abilities: [
        {
          id: "JwgigfOaG8-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Alice Bonus] This card costs 1 less to materialize.",
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
              action: "materialize",
              subject: {
                kind: "source",
              },
              costKind: "memory",
              costOperation: "subtract",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "JwgigfOaG8-a2",
          kind: "activated",
          text: "(3), Banish Lagomorph Piece: Return target Chessman Command card from your graveyard to your memory.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 3,
              },
              {
                kind: "banish-self",
              },
            ],
          },
          targets: [
            {
              id: "target-card",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "card",
                zones: ["graveyard"],
                relationship: "zone-of",
                player: "controller",
                filter: {
                  kind: "subtype",
                  oneOf: ["COMMAND"],
                },
              },
            },
          ],
          effect: {
            kind: "move",
            subject: {
              kind: "bound",
              binding: "target-card",
            },
            from: "graveyard",
            destination: {
              zone: "memory",
            },
          },
        },
      ],
    },
  },
};

export default lagomorphPiece;
