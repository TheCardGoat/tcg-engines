import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ordainedCharisma: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "3iG6h4jAPl",
  slug: "ordained-charisma",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "3iG6h4jAPl:face:default",
      catalogId: "3iG6h4jAPl",
      name: "Ordained Charisma",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "slow",
      stats: {},
      rulesText:
        "Gain control of target ally with 2POWER or less until end of turn. Wake up that ally.",
      abilities: [
        {
          id: "3iG6h4jAPl-a1",
          kind: "card-resolution",
          text: "Gain control of target ally with 2POWER or less until end of turn. Wake up that ally.",
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
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "numeric",
                      comparison: {
                        left: {
                          kind: "property",
                          subject: {
                            kind: "candidate",
                          },
                          property: "power",
                          basis: "current",
                        },
                        operator: "lte",
                        right: 2,
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
                  layer: "control",
                  modifies: "control",
                },
                change: {
                  kind: "control",
                  controller: "controller",
                },
              },
              {
                kind: "wake",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default ordainedCharisma;
