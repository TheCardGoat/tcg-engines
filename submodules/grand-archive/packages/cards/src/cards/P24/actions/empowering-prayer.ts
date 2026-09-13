import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const empoweringPrayer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "yfzk96yd60",
  slug: "empowering-prayer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "yfzk96yd60:face:default",
      catalogId: "yfzk96yd60",
      name: "Empowering Prayer",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Your champion gets +2 level until end of turn. Then if your champion's level is equal to the amount of cards in your memory, draw a card.",
      abilities: [
        {
          id: "yfzk96yd60-a1",
          kind: "card-resolution",
          text: "Your champion gets +2 level until end of turn. Then if your champion's level is equal to the amount of cards in your memory, draw a card.",
          effect: {
            kind: "sequence",
            effects: [
              {
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
                  amount: 2,
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "property",
                      subject: {
                        kind: "champion",
                        player: "controller",
                      },
                      property: "level",
                      basis: "current",
                    },
                    operator: "eq",
                    right: {
                      kind: "count",
                      collection: {
                        zones: ["memory"],
                        player: "controller",
                      },
                    },
                  },
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

export default empoweringPrayer;
