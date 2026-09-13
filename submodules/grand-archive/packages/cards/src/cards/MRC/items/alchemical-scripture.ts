import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const alchemicalScripture: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "h9v2214upu",
  slug: "alchemical-scripture",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "h9v2214upu:face:default",
      catalogId: "h9v2214upu",
      name: "Alchemical Scripture",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "BOOK"],
      },
      elements: ["NEOS"],
      stats: {},
      rulesText:
        "At the beginning of your end phase, if you control four or more tokens, draw a card into your memory.",
      abilities: [
        {
          id: "h9v2214upu-a1",
          kind: "triggered",
          text: "At the beginning of your end phase, if you control four or more tokens, draw a card into your memory.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "end",
              actor: "controller",
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "compare",
              comparison: {
                left: {
                  kind: "count",
                  collection: {
                    zones: ["field"],
                    player: "controller",
                    filter: {
                      kind: "token",
                      value: true,
                    },
                  },
                },
                operator: "gte",
                right: 4,
              },
            },
            then: {
              kind: "draw",
              player: "controller",
              amount: 1,
              to: "memory",
            },
          },
        },
      ],
    },
  },
};

export default alchemicalScripture;
