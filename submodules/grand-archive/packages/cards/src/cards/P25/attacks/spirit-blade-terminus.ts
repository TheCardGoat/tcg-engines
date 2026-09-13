import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const spiritBladeTerminus: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "XsxmnGZxKz",
  slug: "spirit-blade-terminus",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "XsxmnGZxKz:face:default",
      catalogId: "XsxmnGZxKz",
      name: "Spirit Blade: Terminus",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SWORD"],
      },
      elements: ["CRUX"],
      stats: {
        power: 2,
      },
      rulesText:
        "Prepare 1 \n\nTerminus gets +1 POWER for every four sheen counters on your Fractured Memories.\n\nOn Hit: If Terminus was prepared, double the amount of sheen counters on your Fractured Memories and put Terminus into its owner's memory.",
      abilities: [
        {
          id: "XsxmnGZxKz-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Prepare 1",
          keyword: {
            name: "prepare",
            value: 1,
          },
        },
        {
          id: "XsxmnGZxKz-a2",
          kind: "static",
          staticKind: "effects",
          text: "Terminus gets +1 POWER for every four sheen counters on your Fractured Memories.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
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
                amount: {
                  kind: "calculate",
                  operator: "divide",
                  operands: [
                    {
                      kind: "sum-counters",
                      collection: {
                        zones: ["field"],
                        player: "controller",
                        filter: {
                          kind: "name",
                          value: "Fractured Memories",
                        },
                      },
                      counter: {
                        named: "sheen",
                      },
                    },
                    4,
                  ],
                  rounding: "down",
                },
              },
            },
          ],
        },
        {
          id: "XsxmnGZxKz-a3",
          kind: "triggered",
          text: "On Hit: If Terminus was prepared, double the amount of sheen counters on your Fractured Memories and put Terminus into its owner's memory.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "activation-state",
              state: "prepared",
            },
            then: {
              kind: "sequence",
              effects: [
                {
                  kind: "add-counter",
                  subject: {
                    kind: "mastery",
                    player: "controller",
                    name: "Fractured Memories",
                  },
                  counter: {
                    named: "sheen",
                  },
                  amount: {
                    kind: "counter-count",
                    subject: {
                      kind: "mastery",
                      player: "controller",
                      name: "Fractured Memories",
                    },
                    counter: {
                      named: "sheen",
                    },
                  },
                },
                {
                  kind: "move",
                  subject: {
                    kind: "source",
                  },
                  destination: {
                    zone: "memory",
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

export default spiritBladeTerminus;
