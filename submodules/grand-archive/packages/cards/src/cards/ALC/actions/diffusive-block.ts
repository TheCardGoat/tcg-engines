import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const diffusiveBlock: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "o7eanl1gxr",
  slug: "diffusive-block",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "o7eanl1gxr:face:default",
      catalogId: "o7eanl1gxr",
      name: "Diffusive Block",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SKILL", "REACTION"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "This card costs 1 less to activate If you control a Shield item.\n\nPrevent the next 2 damage that would be dealt to target unit this turn.\n\n[Class Bonus] Floating Memory",
      abilities: [
        {
          id: "o7eanl1gxr-a1",
          kind: "static",
          staticKind: "effects",
          text: "This card costs 1 less to activate If you control a Shield item.",
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
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ITEM"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["SHIELD"],
                      },
                    ],
                  },
                },
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "o7eanl1gxr-a2",
          kind: "card-resolution",
          text: "Prevent the next 2 damage that would be dealt to target unit this turn.",
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
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "bound-object",
                binding: "target-1",
              },
            },
            operation: {
              kind: "prevent",
            },
            capacity: {
              amount: 2,
              scope: "replacement-instance",
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
        {
          id: "o7eanl1gxr-a3",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory",
          keyword: {
            name: "floating-memory",
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
        },
      ],
    },
  },
};

export default diffusiveBlock;
