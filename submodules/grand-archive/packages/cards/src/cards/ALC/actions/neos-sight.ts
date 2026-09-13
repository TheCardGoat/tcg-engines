import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const neosSight: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4n1n3gygoj",
  slug: "neos-sight",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4n1n3gygoj:face:default",
      catalogId: "4n1n3gygoj",
      name: "Neos Sight",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["NEOS"],
      speed: "fast",
      stats: {},
      rulesText: "Draw a card. If you control eight or more objects, draw a card into your memory.",
      abilities: [
        {
          id: "4n1n3gygoj-a1",
          kind: "card-resolution",
          text: "Draw a card. If you control eight or more objects, draw a card into your memory.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
              {
                kind: "conditional",
                condition: {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "count",
                      collection: {
                        zones: ["field"],
                        player: "controller",
                      },
                    },
                    operator: "gte",
                    right: 8,
                  },
                },
                then: {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                  to: "memory",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default neosSight;
