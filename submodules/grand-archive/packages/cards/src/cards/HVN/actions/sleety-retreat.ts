import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sleetyRetreat: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "j9fkuzgg9i",
  slug: "sleety-retreat",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "j9fkuzgg9i:face:default",
      catalogId: "j9fkuzgg9i",
      name: "Sleety Retreat",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL", "REACTION"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "Deluge 4 — As long as there are four or more water element cards in your graveyard, this card costs 2 less to activate. \nTarget Ranger unit becomes distant. If that unit is defending, end the combat phase unless an opponent pays (2).",
      abilities: [
        {
          id: "j9fkuzgg9i-a1",
          kind: "card-resolution",
          text: "Deluge 4 — As long as there are four or more water element cards in your graveyard, this card costs 2 less to activate.\nTarget Ranger unit becomes distant. If that unit is defending, end the combat phase unless an opponent pays (2).",
          targets: [
            {
              id: "target-ranger-unit",
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
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          activationRules: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 2,
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "count",
                    collection: {
                      zones: ["graveyard"],
                      player: "controller",
                      filter: {
                        kind: "element",
                        oneOf: ["WATER"],
                      },
                    },
                  },
                  operator: "gte",
                  right: 4,
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "set-object-state",
                subject: {
                  kind: "bound",
                  binding: "target-ranger-unit",
                },
                state: "distant",
                value: true,
              },
              {
                kind: "conditional",
                condition: {
                  kind: "object-state",
                  subject: {
                    kind: "bound",
                    binding: "target-ranger-unit",
                  },
                  state: "defending",
                },
                then: {
                  kind: "unless-paid",
                  player: "opponent",
                  cost: {
                    kind: "pay-reserve",
                    amount: 2,
                  },
                  otherwise: {
                    kind: "end-phase",
                    phase: "combat",
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

export default sleetyRetreat;
