import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const excoriate: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ls6g7xgwve",
  slug: "excoriate",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ls6g7xgwve:face:default",
      catalogId: "ls6g7xgwve",
      name: "Excoriate",
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
      elements: ["FIRE"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Level 2+] This card costs 1 less to activate. (Apply this effect only if your champion is level 2 or higher.)\n\nDestroy target ally with reserve cost 4 or less.",
      abilities: [
        {
          id: "ls6g7xgwve-a1",
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
          id: "ls6g7xgwve-a2",
          kind: "card-resolution",
          text: "Destroy target ally with reserve cost 4 or less.",
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
            bindResultAs: "destroyed-object",
          },
        },
      ],
    },
  },
};

export default excoriate;
