import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lavasoulTiger: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "zq0dvl1m3z",
  slug: "lavasoul-tiger",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "zq0dvl1m3z:face:default",
      catalogId: "zq0dvl1m3z",
      name: "Lavasoul Tiger",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "TIGER"],
      },
      elements: ["FIRE"],
      stats: {
        power: 5,
        life: 5,
      },
      rulesText:
        "Pride 3 (This ally won’t obey you unless your champion is level 3 or higher. You can’t attack with, intercept with, or activate abilities of allies that don’t obey you.)\n\n[Class Bonus] On Enter: You may banish two fire element cards from your graveyard. If you do, Lavasoul Tiger loses pride until end of turn.",
      abilities: [
        {
          id: "zq0dvl1m3z-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Pride 3 (This ally won’t obey you unless your champion is level 3 or higher. You can’t attack with, intercept with, or activate abilities of allies that don’t obey you.)",
          keyword: {
            name: "pride",
            value: 3,
          },
        },
        {
          id: "zq0dvl1m3z-a2",
          kind: "triggered",
          text: "[Class Bonus] On Enter: You may banish two fire element cards from your graveyard. If you do, Lavasoul Tiger loses pride until end of turn.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
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
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "banish",
                  player: "controller",
                  selection: {
                    id: "banished-cards",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 2,
                    },
                    candidates: {
                      kind: "card",
                      zones: ["graveyard"],
                      relationship: "zone-of",
                      player: "controller",
                      filter: {
                        kind: "element",
                        oneOf: ["FIRE"],
                      },
                    },
                  },
                },
                {
                  kind: "continuous",
                  subjects: {
                    kind: "source",
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
                    kind: "remove-keyword",
                    keyword: {
                      name: "pride",
                      anyValue: true,
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default lavasoulTiger;
