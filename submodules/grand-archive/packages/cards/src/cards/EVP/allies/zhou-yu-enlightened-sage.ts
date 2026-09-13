import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const zhouYuEnlightenedSage: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "55d7vo62fc",
  slug: "zhou-yu-enlightened-sage",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "55d7vo62fc:face:default",
      catalogId: "55d7vo62fc",
      name: "Zhou Yu, Enlightened Sage",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "[Class Bonus] On Enter: Materialize a Book or Scripture card from your material deck. (You still pay its costs.)\n \n[Class Bonus] At the beginning of your recollection phase, if you control a Book or Scripture object, put an enlighten counter on your champion.",
      abilities: [
        {
          id: "55d7vo62fc-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Materialize a Book or Scripture card from your material deck. (You still pay its costs.)",
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
            kind: "choose",
            selection: {
              id: "materialized-card",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              candidates: {
                kind: "card",
                zones: ["material-deck"],
                relationship: "zone-of",
                player: "controller",
                filter: {
                  kind: "subtype",
                  oneOf: ["SCRIPTURE"],
                },
              },
            },
            effect: {
              kind: "materialize-card",
              subject: {
                kind: "bound",
                binding: "materialized-card",
              },
            },
          },
        },
        {
          id: "55d7vo62fc-a2",
          kind: "triggered",
          text: "[Class Bonus] At the beginning of your recollection phase, if you control a Book or Scripture object, put an enlighten counter on your champion.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
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
            kind: "conditional",
            condition: {
              kind: "collection-exists",
              collection: {
                zones: ["field"],
                player: "controller",
                filter: {
                  kind: "any",
                  filters: [
                    {
                      kind: "subtype",
                      oneOf: ["BOOK"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["SCRIPTURE"],
                    },
                  ],
                },
              },
            },
            then: {
              kind: "add-counter",
              subject: {
                kind: "champion",
                player: "controller",
              },
              counter: "enlighten",
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default zhouYuEnlightenedSage;
