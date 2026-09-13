import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const refractingMissile: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "6ffqsuo6gb",
  slug: "refracting-missile",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "6ffqsuo6gb:face:default",
      catalogId: "6ffqsuo6gb",
      name: "Refracting Missile",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "Deal damage to target unit equal to the amount of Fractal objects you control plus 1.\n\nFloating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "6ffqsuo6gb-a1",
          kind: "card-resolution",
          text: "Deal damage to target unit equal to the amount of Fractal objects you control plus 1.",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "bound",
              binding: "target-1",
            },
            amount: {
              kind: "calculate",
              operator: "add",
              operands: [
                {
                  kind: "count",
                  collection: {
                    zones: ["field"],
                    player: "controller",
                    filter: {
                      kind: "subtype",
                      oneOf: ["FRACTAL"],
                    },
                  },
                },
                1,
              ],
            },
          },
        },
        {
          id: "6ffqsuo6gb-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
  },
};

export default refractingMissile;
