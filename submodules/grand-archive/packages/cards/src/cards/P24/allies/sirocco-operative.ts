import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const siroccoOperative: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "t7ru41pzgg",
  slug: "sirocco-operative",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "t7ru41pzgg:face:default",
      catalogId: "t7ru41pzgg",
      name: "Sirocco Operative",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "AUTOMATON"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText:
        "[Class Bonus] On Enter: Draw a card into your memory.\n\nOn Enter: If you control another Automaton ally, put a preparation counter on your champion.",
      abilities: [
        {
          id: "t7ru41pzgg-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Draw a card into your memory.",
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
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
        {
          id: "t7ru41pzgg-a2",
          kind: "triggered",
          text: "On Enter: If you control another Automaton ally, put a preparation counter on your champion.",
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
                      oneOf: ["AUTOMATON"],
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
              counter: "preparation",
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default siroccoOperative;
