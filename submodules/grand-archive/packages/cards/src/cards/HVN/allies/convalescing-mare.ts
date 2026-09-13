import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const convalescingMare: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ysj63dw50a",
  slug: "convalescing-mare",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ysj63dw50a:face:default",
      catalogId: "ysj63dw50a",
      name: "Convalescing Mare",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC", "TAMER"],
        subtypes: ["CLERIC", "TAMER", "ANIMAL", "HORSE"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "[Class Bonus] Fast Activation (You may activate this card at fast speed.)\n\n[Class Bonus] On Enter: Recover 1. Other allies you control get +1 LIFE until end of turn.",
      abilities: [
        {
          id: "ysj63dw50a-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Fast Activation (You may activate this card at fast speed.)",
          keyword: {
            name: "fast-activation",
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
        {
          id: "ysj63dw50a-a2",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Recover 1. Other allies you control get +1 LIFE until end of turn.",
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
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
          effect: {
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
                      kind: "not-source",
                    },
                    {
                      kind: "subtype",
                      oneOf: ["OTHER"],
                    },
                  ],
                },
              },
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
              property: "life",
              operation: "add",
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default convalescingMare;
