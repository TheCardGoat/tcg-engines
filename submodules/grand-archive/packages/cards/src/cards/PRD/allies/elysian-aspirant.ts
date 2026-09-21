import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const elysianAspirant: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "HHtlkEeyQR",
  slug: "elysian-aspirant",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "HHtlkEeyQR:face:default",
      catalogId: "HHtlkEeyQR",
      name: "Elysian Aspirant",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "ELYSIAN", "HUMAN"],
      },
      elements: ["EXIA"],
      stats: {
        power: 0,
        life: 2,
      },
      rulesText:
        "Elysian Aura\n\nIf an Aenean Spell source you control would deal damage to one or more units, it deals that much damage plus 1 to those units instead.\n\nOn Death: You may have Elysian Aspirant deal 2 unpreventable damage to your champion. If you do, draw a card.",
      abilities: [
        {
          id: "HHtlkEeyQR-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Elysian Aura",
          keyword: {
            name: "elysian-aura",
          },
        },
        {
          id: "HHtlkEeyQR-a2",
          kind: "static",
          staticKind: "effects",
          text: "If an Aenean Spell source you control would deal damage to one or more units, it deals that much damage plus 1 to those units instead.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "damage-dealt",
                subject: {
                  kind: "event-object",
                  controller: "controller",
                  filter: {
                    kind: "subtype",
                    oneOf: ["SPELL"],
                  },
                },
              },
              operation: {
                kind: "modify-amount",
                operation: "add",
                amount: 1,
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "HHtlkEeyQR-a3",
          kind: "triggered",
          text: "On Death: You may have Elysian Aspirant deal 2 unpreventable damage to your champion. If you do, draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "attempt",
                  effect: {
                    kind: "deal-damage",
                    source: {
                      kind: "source",
                    },
                    recipient: {
                      kind: "champion",
                      player: "controller",
                    },
                    amount: 2,
                    preventable: false,
                  },
                  bindSucceededAs: "optional-action-succeeded",
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "effect-succeeded",
                    binding: "optional-action-succeeded",
                  },
                  then: {
                    kind: "draw",
                    player: "controller",
                    amount: 1,
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default elysianAspirant;
