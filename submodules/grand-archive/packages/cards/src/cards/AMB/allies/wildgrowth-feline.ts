import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const wildgrowthFeline: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "3krdvxapdp",
  slug: "wildgrowth-feline",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "3krdvxapdp:face:default",
      catalogId: "3krdvxapdp",
      name: "Wildgrowth Feline",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "CAT"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "[Class Bonus] Whenever another Animal and/or Beast ally enters the field under your control, put a buff counter on Wildgrowth Feline. (Allies get +1 POWER and +1 LIFE for each buff counter on them. Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "3krdvxapdp-a1",
          kind: "triggered",
          text: "[Class Bonus] Whenever another Animal and/or Beast ally enters the field under your control, put a buff counter on Wildgrowth Feline. (Allies get +1 POWER and +1 LIFE for each buff counter on them. Apply this effect only if your champion's class matches this card's class.)",
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
                    {
                      kind: "not-source",
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
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: "buff",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default wildgrowthFeline;
