import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const expelTheDeparted: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "9wxcgpy069",
  slug: "expel-the-departed",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "9wxcgpy069:face:default",
      catalogId: "9wxcgpy069",
      name: "Expel the Departed",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "FATEBOUND", "SPELL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Level 2+] This card costs 1 less to activate. (Apply this effect only if your champion is level 2 or higher.)\n\nDestroy up to one target phantasia. If you control two or more Fatestone and/or Fatebound objects, draw a card.",
      abilities: [
        {
          id: "9wxcgpy069-a1",
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
          id: "9wxcgpy069-a2",
          kind: "card-resolution",
          text: "Destroy up to one target phantasia. If you control two or more Fatestone and/or Fatebound objects, draw a card.",
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
                filter: {
                  kind: "type",
                  oneOf: ["PHANTASIA"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "destroy",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "count",
                      collection: {
                        zones: ["field"],
                        player: "controller",
                        filter: {
                          kind: "any",
                          filters: [
                            {
                              kind: "subtype",
                              oneOf: ["FATESTONE"],
                            },
                            {
                              kind: "subtype",
                              oneOf: ["FATEBOUND"],
                            },
                          ],
                        },
                      },
                    },
                    operator: "gte",
                    right: 2,
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

export default expelTheDeparted;
