import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const silvieWithThePack: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "nllCALIXDT",
  slug: "silvie-with-the-pack",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "nllCALIXDT:face:default",
      catalogId: "nllCALIXDT",
      name: "Silvie, With the Pack",
      lineageName: "Silvie",
      cost: {
        kind: "memory",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 2,
        life: 22,
      },
      rulesText:
        'Silvie Lineage (Silvie, With the Pack must be leveled from a previous level "Silvie" champion.)\n\nOn Enter: If you control an Animal ally, draw a card. If you control a Beast ally, draw a card.',
      abilities: [
        {
          id: "nllCALIXDT-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: 'Silvie Lineage (Silvie, With the Pack must be leveled from a previous level "Silvie" champion.)',
          keyword: {
            name: "lineage",
            lineageName: "Silvie",
          },
        },
        {
          id: "nllCALIXDT-a2",
          kind: "triggered",
          text: "On Enter: If you control an Animal ally, draw a card. If you control a Beast ally, draw a card.",
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
                kind: "conditional",
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
                          oneOf: ["ALLY"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["ANIMAL"],
                        },
                      ],
                    },
                  },
                },
                then: {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                },
              },
              {
                kind: "conditional",
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
                          oneOf: ["ALLY"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["BEAST"],
                        },
                      ],
                    },
                  },
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
      ],
    },
  },
};

export default silvieWithThePack;
