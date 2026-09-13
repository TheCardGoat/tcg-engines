import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const forestCake: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "bjx6yo7mm5",
  slug: "forest-cake",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "bjx6yo7mm5:face:default",
      catalogId: "bjx6yo7mm5",
      name: "Forest Cake",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "FOOD"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "On Enter: Draw a card.\n\n[Class Bonus] Whenever an Animal or Beast ally enters the field under your control, you may sacrifice Forest Cake. If you do, put a buff counter on that ally.",
      abilities: [
        {
          id: "bjx6yo7mm5-a1",
          kind: "triggered",
          text: "On Enter: Draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
        {
          id: "bjx6yo7mm5-a2",
          kind: "triggered",
          text: "[Class Bonus] Whenever an Animal or Beast ally enters the field under your control, you may sacrifice Forest Cake. If you do, put a buff counter on that ally.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "any",
                      filters: [
                        {
                          kind: "subtype",
                          oneOf: ["ANIMAL"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["BEAST"],
                        },
                      ],
                    },
                  ],
                },
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
                  kind: "add-counter",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  counter: "buff",
                  amount: 1,
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default forestCake;
