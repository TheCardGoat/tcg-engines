import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cavalierRescue: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "75uhspxqme",
  slug: "cavalier-rescue",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "75uhspxqme:face:default",
      catalogId: "75uhspxqme",
      name: "Cavalier Rescue",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "HORSE", "SKILL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Equestrian — As long as you control a Horse ally, this card costs 2 less to activate.\n\nTarget ally gets +3 LIFE until end of turn. If that ally is defending, wake it up.",
      abilities: [
        {
          id: "75uhspxqme-a1",
          kind: "static",
          staticKind: "effects",
          text: "Equestrian — As long as you control a Horse ally, this card costs 2 less to activate.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "collection-exists",
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
                        kind: "subtype",
                        oneOf: ["HORSE"],
                      },
                    ],
                  },
                },
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
          label: {
            name: "Equestrian",
          },
        },
        {
          id: "75uhspxqme-a2",
          kind: "card-resolution",
          text: "Target ally gets +3 LIFE until end of turn. If that ally is defending, wake it up.",
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
                  kind: "type",
                  oneOf: ["ALLY"],
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
                  layer: "E",
                  modifies: "stat",
                  sublayer: "modifier",
                },
                change: {
                  kind: "numeric",
                  property: "life",
                  operation: "add",
                  amount: 3,
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "object-state",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  state: "defending",
                },
                then: {
                  kind: "wake",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
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

export default cavalierRescue;
