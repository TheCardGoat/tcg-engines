import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const calmingBreeze: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "XgJ72Ot13P",
  slug: "calming-breeze",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "XgJ72Ot13P:face:default",
      catalogId: "XgJ72Ot13P",
      name: "Calming Breeze",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL", "REACTION"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "Until end of turn, if 3 or less damage would be dealt to your champion, prevent that damage.\n\n[Level 1+]Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "XgJ72Ot13P-a1",
          kind: "card-resolution",
          text: "Until end of turn, if 3 or less damage would be dealt to your champion, prevent that damage.",
          effect: {
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
              amountComparison: {
                left: {
                  kind: "event-amount",
                },
                operator: "lte",
                right: 3,
              },
            },
            operation: {
              kind: "prevent",
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
        {
          id: "XgJ72Ot13P-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Level 1+]Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
          },
          restrictions: [
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 1,
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default calmingBreeze;
