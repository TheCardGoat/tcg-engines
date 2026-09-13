import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const favorableOmens: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "tqy0rwvxgs",
  slug: "favorable-omens",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "tqy0rwvxgs:face:default",
      catalogId: "tqy0rwvxgs",
      name: "Favorable Omens",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SPELL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "For each wind element omen you have, allies you control get +1LIFE until end of turn.",
      abilities: [
        {
          id: "tqy0rwvxgs-a1",
          kind: "card-resolution",
          text: "For each wind element omen you have, allies you control get +1LIFE until end of turn.",
          effect: {
            kind: "repeat",
            count: {
              kind: "count",
              collection: {
                zones: ["banishment"],
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "has-counter",
                      counter: "omen",
                    },
                    {
                      kind: "element",
                      oneOf: ["WIND"],
                    },
                  ],
                },
              },
            },
            effect: {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["ALLY"],
                  },
                },
              },
              affectedSet: "locked",
              duration: {
                kind: "this-turn",
              },
              layer: {
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "life",
                operation: "add",
                amount: 1,
              },
            },
          },
        },
      ],
    },
  },
};

export default favorableOmens;
