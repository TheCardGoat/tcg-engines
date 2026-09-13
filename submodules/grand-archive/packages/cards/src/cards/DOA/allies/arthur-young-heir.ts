import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const arthurYoungHeir: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "GjM8b5fxqj",
  slug: "arthur-young-heir",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "GjM8b5fxqj:face:default",
      catalogId: "GjM8b5fxqj",
      name: "Arthur, Young Heir",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "On Enter: You may rest Arthur. If you do, Arthur gains immortality until the beginning of your next turn. (A unit with immortality can't die.)\n\nAs long as Arthur is rested, other allies you control get +1 POWER.",
      abilities: [
        {
          id: "GjM8b5fxqj-a1",
          kind: "triggered",
          text: "On Enter: You may rest Arthur. If you do, Arthur gains immortality until the beginning of your next turn. (A unit with immortality can't die.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "rest",
                  subject: {
                    kind: "source",
                  },
                },
                {
                  kind: "continuous",
                  subjects: {
                    kind: "source",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "until-start-of-turn",
                    whose: "controller",
                  },
                  layer: {
                    layer: "D",
                    modifies: "ability",
                  },
                  change: {
                    kind: "grant-keyword",
                    keyword: {
                      name: "immortality",
                    },
                  },
                },
              ],
            },
          },
        },
        {
          id: "GjM8b5fxqj-a2",
          kind: "static",
          staticKind: "effects",
          text: "As long as Arthur is rested, other allies you control get +1 POWER.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
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
                        kind: "not-source",
                      },
                    ],
                  },
                },
              },
              affectedSet: "dynamic",
              condition: {
                kind: "object-state",
                subject: {
                  kind: "source",
                },
                state: "rested",
              },
              duration: {
                kind: "while-source-in-functional-zone",
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
          ],
        },
      ],
    },
  },
};

export default arthurYoungHeir;
