import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const baubleOfMending: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "hLHpI5rHIK",
  slug: "bauble-of-mending",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "hLHpI5rHIK:face:default",
      catalogId: "hLHpI5rHIK",
      name: "Bauble of Mending",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BAUBLE"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Banish Bauble of Mending: Draw a card. Class Bonus: Up to one target non-Human ally you control gets +1 LIFE until end of turn. (Apply the additional effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "hLHpI5rHIK-a1",
          kind: "activated",
          text: "Banish Bauble of Mending: Draw a card. Class Bonus: Up to one target non-Human ally you control gets +1 LIFE until end of turn. (Apply the additional effect only if your champion's class matches this card's class.)",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "up-to",
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
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "not",
                      filter: {
                        kind: "subtype",
                        oneOf: ["HUMAN"],
                      },
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
                kind: "draw",
                player: "controller",
                amount: 1,
              },
              {
                kind: "conditional",
                condition: {
                  kind: "champion-matches-source",
                  characteristic: "class",
                },
                then: {
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
            ],
          },
        },
      ],
    },
  },
};

export default baubleOfMending;
