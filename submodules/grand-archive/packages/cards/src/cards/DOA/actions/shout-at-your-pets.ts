import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const shoutAtYourPets: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "gvXQa57cxe",
  slug: "shout-at-your-pets",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "gvXQa57cxe:face:default",
      catalogId: "gvXQa57cxe",
      name: "Shout at Your Pets",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SKILL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "If you control an Animal or Beast ally, your champion gets +1 level until end of turn.\n\n[Class Bonus] You may discard a card. If you do, draw a card. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "gvXQa57cxe-a1",
          kind: "card-resolution",
          text: "If you control an Animal or Beast ally, your champion gets +1 level until end of turn.",
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
              },
            },
            then: {
              kind: "continuous",
              subjects: {
                kind: "champion",
                player: "controller",
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
                property: "level",
                operation: "add",
                amount: 1,
              },
            },
          },
        },
        {
          id: "gvXQa57cxe-a2",
          kind: "card-resolution",
          text: "[Class Bonus] You may discard a card. If you do, draw a card. (Apply this effect only if your champion's class matches this card's class.)",
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "discard",
                  player: "controller",
                  selection: {
                    id: "discarded-card",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    candidates: {
                      kind: "card",
                      zones: ["hand"],
                      relationship: "zone-of",
                      player: "controller",
                    },
                  },
                },
                {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default shoutAtYourPets;
