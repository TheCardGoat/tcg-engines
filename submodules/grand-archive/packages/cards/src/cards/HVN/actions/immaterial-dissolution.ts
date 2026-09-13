import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const immaterialDissolution: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "55d9w9uuvq",
  slug: "immaterial-dissolution",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "55d9w9uuvq:face:default",
      catalogId: "55d9w9uuvq",
      name: "Immaterial Dissolution",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Level 2+] This card costs 1 less to activate. (Apply this effect only if your champion is level 2 or higher.)\n\nDestroy up to three target non-regalia token objects with total reserve cost 4 or less.",
      abilities: [
        {
          id: "55d9w9uuvq-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Level 2+] This card costs 1 less to activate. (Apply this effect only if your champion is level 2 or higher.)",
          restrictions: [
            {
              kind: "static",
              name: "level-restriction",
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
                  operator: "gte",
                  right: 2,
                },
              },
            },
          ],
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "55d9w9uuvq-a2",
          kind: "card-resolution",
          text: "Destroy up to three target non-regalia token objects with total reserve cost 4 or less.",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 3,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "token",
                      value: true,
                    },
                    {
                      kind: "supertype",
                      oneOf: ["REGALIA"],
                    },
                    {
                      kind: "numeric",
                      comparison: {
                        left: {
                          kind: "property",
                          subject: {
                            kind: "candidate",
                          },
                          property: "reserve-cost",
                          basis: "base",
                        },
                        operator: "lte",
                        right: 4,
                      },
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "destroy",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
          },
        },
      ],
    },
  },
};

export default immaterialDissolution;
