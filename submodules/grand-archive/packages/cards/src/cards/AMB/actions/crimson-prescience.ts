import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const crimsonPrescience: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "0dsdojl6l3",
  slug: "crimson-prescience",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "0dsdojl6l3:face:default",
      catalogId: "0dsdojl6l3",
      name: "Crimson Prescience",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SKILL", "REACTION"],
      },
      elements: ["EXIA"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] [Damage 25+] This card costs 1 less to activate. (Apply this effect only if there are twenty-five or more damage counters on your champion.)\n\nChoose a card name. Until end of turn, if damage would be dealt to your champion by a source with that name, prevent that damage.",
      abilities: [
        {
          id: "0dsdojl6l3-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] [Damage 25+] This card costs 1 less to activate. (Apply this effect only if there are twenty-five or more damage counters on your champion.)",
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
            {
              kind: "static",
              name: "damage-restriction",
              condition: {
                kind: "has-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: "damage",
                comparison: {
                  left: {
                    kind: "counter-count",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    counter: "damage",
                  },
                  operator: "gte",
                  right: 25,
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
          id: "0dsdojl6l3-a2",
          kind: "card-resolution",
          text: "Choose a card name. Until end of turn, if damage would be dealt to your champion by a source with that name, prevent that damage.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "choose-value",
                selection: {
                  id: "chosen-card-name",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  candidates: {
                    kind: "characteristic",
                    characteristic: "card-name",
                  },
                },
                trackAs: "chosen-card-name",
              },
              {
                kind: "replacement",
                event: {
                  name: "damage-dealt",
                  subject: {
                    kind: "event-object",
                    filter: {
                      kind: "matches-tracked-characteristic",
                      key: "chosen-card-name",
                      characteristic: "card-name",
                    },
                  },
                  recipient: {
                    kind: "event-object",
                    controller: "controller",
                    filter: {
                      kind: "type",
                      oneOf: ["CHAMPION"],
                    },
                  },
                },
                operation: {
                  kind: "prevent",
                },
                duration: {
                  kind: "this-turn",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default crimsonPrescience;
