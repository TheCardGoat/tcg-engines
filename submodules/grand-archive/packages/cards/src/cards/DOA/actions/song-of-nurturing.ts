import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const songOfNurturing: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4hbA9FT56L",
  slug: "song-of-nurturing",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4hbA9FT56L:face:default",
      catalogId: "4hbA9FT56L",
      name: "Song of Nurturing",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SKILL", "MELODY"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Allies you control get +2 LIFE until end of turn. Class Bonus: Those allies also get +1 POWER until end of turn. (Apply the additional effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "4hbA9FT56L-a1",
          kind: "card-resolution",
          text: "Allies you control get +2 LIFE until end of turn. Class Bonus: Those allies also get +1 POWER until end of turn. (Apply the additional effect only if your champion's class matches this card's class.)",
          effect: {
            kind: "sequence",
            effects: [
              {
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
                  amount: 2,
                },
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
                    property: "power",
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

export default songOfNurturing;
