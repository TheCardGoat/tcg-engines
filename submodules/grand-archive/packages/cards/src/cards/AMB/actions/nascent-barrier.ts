import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const nascentBarrier: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "6bc3ogf0o8",
  slug: "nascent-barrier",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "6bc3ogf0o8:face:default",
      catalogId: "6bc3ogf0o8",
      name: "Nascent Barrier",
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
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] Prevent the next 1+LV damage that would be dealt to your champion this turn.\n\n[Level 3+] Glimpse 3. (To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order.)",
      abilities: [
        {
          id: "6bc3ogf0o8-a1",
          kind: "card-resolution",
          text: "[Class Bonus] Prevent the next 1+LV damage that would be dealt to your champion this turn.",
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
            },
            operation: {
              kind: "prevent",
            },
            capacity: {
              amount: {
                kind: "calculate",
                operator: "add",
                operands: [
                  1,
                  {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                ],
              },
              scope: "replacement-instance",
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
        {
          id: "6bc3ogf0o8-a2",
          kind: "card-resolution",
          text: "[Level 3+] Glimpse 3. (To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order.)",
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
                  right: 3,
                },
              },
            },
          ],
          effect: {
            kind: "keyword-action",
            action: "glimpse",
            amount: 3,
          },
        },
      ],
    },
  },
};

export default nascentBarrier;
