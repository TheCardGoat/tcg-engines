import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const equipWithCourage: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "eU8IEVpFZg",
  slug: "equip-with-courage",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "eU8IEVpFZg:face:default",
      catalogId: "eU8IEVpFZg",
      name: "Equip with Courage",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Target ally's next attack this turn gets +XPOWER, where X is the amount of items linked to that ally plus 1.\n\nFloating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "eU8IEVpFZg-a1",
          kind: "card-resolution",
          text: "Target ally's next attack this turn gets +XPOWER, where X is the amount of items linked to that ally plus 1.",
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
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "calculate",
                operator: "add",
                operands: [
                  {
                    kind: "count",
                    collection: {
                      zones: ["field"],
                      host: {
                        kind: "bound",
                        binding: "target-1",
                      },
                      relationship: "linked-to",
                      filter: {
                        kind: "type",
                        oneOf: ["ITEM"],
                      },
                    },
                  },
                  1,
                ],
              },
            },
          ],
          effect: {
            kind: "create-delayed-trigger",
            trigger: {
              kind: "event",
              event: {
                name: "attack-declared",
                subject: {
                  kind: "bound-object",
                  binding: "target-1",
                },
              },
            },
            limit: 1,
            expires: {
              kind: "this-turn",
            },
            effect: {
              kind: "continuous",
              subjects: {
                kind: "current-attack",
              },
              affectedSet: "locked",
              duration: {
                kind: "this-attack",
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
                amount: {
                  kind: "variable",
                  symbol: "X",
                },
              },
            },
          },
        },
        {
          id: "eU8IEVpFZg-a2",
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

export default equipWithCourage;
