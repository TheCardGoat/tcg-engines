import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const schwartzCastler: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "PDLfDZFari",
  slug: "schwartz-castler",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "PDLfDZFari:face:default",
      catalogId: "PDLfDZFari",
      name: "Schwartz Castler",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "CHESSMAN", "ROOK"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText:
        "Commanded Will 1 (As long as this unit is attacking using a Command card, it gets +1POWER.)\n\n[Alice Bonus] On Enter: If an opponent controls a unit with an even life stat, summon a Pawn Piece token.",
      abilities: [
        {
          id: "PDLfDZFari-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Commanded Will 1 (As long as this unit is attacking using a Command card, it gets +1POWER.)",
          keyword: {
            name: "commanded-will",
            value: 1,
          },
        },
        {
          id: "PDLfDZFari-a2",
          kind: "triggered",
          text: "[Alice Bonus] On Enter: If an opponent controls a unit with an even life stat, summon a Pawn Piece token.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
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
            kind: "conditional",
            condition: {
              kind: "collection-exists",
              collection: {
                zones: ["field"],
                player: "each-opponent",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
            then: {
              kind: "summon",
              object: "Pawn Piece",
              controller: "controller",
              bindResultAs: "summoned-token",
            },
          },
        },
      ],
    },
  },
};

export default schwartzCastler;
