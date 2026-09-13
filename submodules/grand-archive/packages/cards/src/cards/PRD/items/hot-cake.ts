import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const hotCake: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "FqFdOEOTbJ",
  slug: "hot-cake",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "FqFdOEOTbJ:face:default",
      catalogId: "FqFdOEOTbJ",
      name: "Hot Cake",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "FOOD"],
      },
      elements: ["FIRE"],
      stats: {},
      rulesText:
        "Whenever an ally enters the field, you may sacrifice Hot Cake. If you do, that ally's next attack this turn gets +3POWER.\n\nFloating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "FqFdOEOTbJ-a1",
          kind: "triggered",
          text: "Whenever an ally enters the field, you may sacrifice Hot Cake. If you do, that ally's next attack this turn gets +3POWER.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
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
                  kind: "sacrifice",
                  subject: {
                    kind: "source",
                  },
                },
                {
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
                      amount: 3,
                    },
                  },
                },
              ],
            },
          },
        },
        {
          id: "FqFdOEOTbJ-a2",
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

export default hotCake;
