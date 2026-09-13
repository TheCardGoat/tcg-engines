import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const aetherwingsWard: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "avTtlUGinE",
  slug: "aetherwings-ward",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "avTtlUGinE:face:default",
      catalogId: "avTtlUGinE",
      name: "Aetherwing's Ward",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL", "REACTION"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Target Aetherwing weapon you control gains spellshroud until end of turn. If your champion is distant, draw a card. (Objects with spellshroud can’t be targeted by Spells.)",
      abilities: [
        {
          id: "avTtlUGinE-a1",
          kind: "card-resolution",
          text: "Target Aetherwing weapon you control gains spellshroud until end of turn. If your champion is distant, draw a card. (Objects with spellshroud can’t be targeted by Spells.)",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["WEAPON"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["AETHERWING"],
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "continuous",
                subjects: {
                  kind: "bound",
                  binding: "target-1",
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-turn",
                },
                layer: {
                  layer: "D",
                  modifies: "ability",
                },
                change: {
                  kind: "grant-keyword",
                  keyword: {
                    name: "spellshroud",
                  },
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "object-state",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  state: "distant",
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

export default aetherwingsWard;
