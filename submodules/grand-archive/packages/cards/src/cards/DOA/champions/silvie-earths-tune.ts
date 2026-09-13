import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const silvieEarthsTune: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ZR8tnLruR6",
  slug: "silvie-earths-tune",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ZR8tnLruR6:face:default",
      catalogId: "ZR8tnLruR6",
      name: "Silvie, Earth's Tune",
      lineageName: "Silvie",
      cost: {
        kind: "memory",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "HUMAN"],
      },
      elements: ["TERA"],
      stats: {
        level: 3,
        life: 25,
      },
      rulesText:
        'Silvie Lineage (Silvie, Earth\'s Tune must be leveled from a previous level "Silvie" champion.)\n\nOn Enter: Reveal cards from the top of your deck until you reveal a tera element Animal or Beast ally card. Put that card into your hand and the rest on the bottom of your deck in a random order.',
      abilities: [
        {
          id: "ZR8tnLruR6-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: 'Silvie Lineage (Silvie, Earth\'s Tune must be leveled from a previous level "Silvie" champion.)',
          keyword: {
            name: "lineage",
            lineageName: "Silvie",
          },
        },
        {
          id: "ZR8tnLruR6-a2",
          kind: "triggered",
          text: "On Enter: Reveal cards from the top of your deck until you reveal a tera element Animal or Beast ally card. Put that card into your hand and the rest on the bottom of your deck in a random order.",
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
            kind: "sequence",
            effects: [
              {
                kind: "reveal-until",
                player: "controller",
                zone: "main-deck",
                stopWhen: {
                  kind: "all",
                  filters: [
                    {
                      kind: "element",
                      oneOf: ["TERA"],
                    },
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
                bindMatchAs: "revealed-match",
                bindRemainderAs: "revealed-remainder",
              },
              {
                kind: "move",
                subject: {
                  kind: "bound",
                  binding: "revealed-match",
                },
                from: "main-deck",
                destination: {
                  zone: "hand",
                },
              },
              {
                kind: "move",
                subject: {
                  kind: "bound",
                  binding: "revealed-remainder",
                },
                from: "main-deck",
                destination: {
                  zone: "main-deck",
                  placement: {
                    kind: "bottom",
                    order: {
                      kind: "random",
                    },
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default silvieEarthsTune;
