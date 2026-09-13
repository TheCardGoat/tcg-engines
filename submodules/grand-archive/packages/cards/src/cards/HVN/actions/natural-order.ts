import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const naturalOrder: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ny1te7hcjm",
  slug: "natural-order",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ny1te7hcjm:face:default",
      catalogId: "ny1te7hcjm",
      name: "Natural Order",
      cost: {
        kind: "reserve",
        amount: 10,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["TERA"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] Efficiency\n\nPut all cards from your hand and memory on the bottom of your deck in any order. Then put all preserved cards from your material deck into your memory.",
      abilities: [
        {
          id: "ny1te7hcjm-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Efficiency",
          keyword: {
            name: "efficiency",
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
        },
        {
          id: "ny1te7hcjm-a2",
          kind: "card-resolution",
          text: "Put all cards from your hand and memory on the bottom of your deck in any order. Then put all preserved cards from your material deck into your memory.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "move",
                subject: {
                  kind: "each",
                  collection: {
                    zones: ["hand", "memory"],
                    player: "controller",
                  },
                },
                destination: {
                  zone: "main-deck",
                  placement: {
                    kind: "bottom",
                    orderChosenBy: "controller",
                  },
                },
              },
              {
                kind: "move",
                subject: {
                  kind: "each",
                  collection: {
                    zones: ["material-deck"],
                    player: "controller",
                    filter: {
                      kind: "object-state",
                      state: "preserved",
                    },
                  },
                },
                destination: {
                  zone: "memory",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default naturalOrder;
