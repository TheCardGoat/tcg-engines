import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lustrousSlime: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ejvddohjdu",
  slug: "lustrous-slime",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ejvddohjdu:face:default",
      catalogId: "ejvddohjdu",
      name: "Lustrous Slime",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "SLIME"],
      },
      elements: ["LUXEM"],
      stats: {
        power: 1,
        life: 5,
      },
      rulesText:
        "Pride 5, Taunt\n\nOn Enter: Reveal any amount of Slime cards from your memory. For each card revealed this way, put a buff counter on Lustrous Slime.\n\nOn Death: Recover X, where X is the amount of buff counters that were on Lustrous Slime.",
      abilities: [
        {
          id: "ejvddohjdu-a1",
          kind: "keyword-group",
          text: "Pride 5, Taunt",
          keywords: [
            {
              name: "pride",
              value: 5,
            },
            {
              name: "taunt",
            },
          ],
        },
        {
          id: "ejvddohjdu-a2",
          kind: "triggered",
          text: "On Enter: Reveal any amount of Slime cards from your memory. For each card revealed this way, put a buff counter on Lustrous Slime.",
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
                kind: "reveal",
                player: "controller",
                selection: {
                  id: "reveal-selection",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "any-number",
                  },
                  candidates: {
                    kind: "card",
                    zones: ["memory"],
                    relationship: "zone-of",
                    player: "controller",
                    filter: {
                      kind: "subtype",
                      oneOf: ["SLIME"],
                    },
                  },
                },
              },
              {
                kind: "for-each",
                collection: {
                  binding: "reveal-selection",
                },
                bindEachAs: "that-card",
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
        {
          id: "ejvddohjdu-a3",
          kind: "triggered",
          text: "On Death: Recover X, where X is the amount of buff counters that were on Lustrous Slime.",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
              subject: {
                kind: "source",
              },
            },
          },
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "counter-count",
                subject: {
                  kind: "source",
                },
                counter: "buff",
              },
            },
          ],
          effect: {
            kind: "recover",
            player: "controller",
            amount: {
              kind: "variable",
              symbol: "X",
            },
          },
        },
      ],
    },
  },
};

export default lustrousSlime;
