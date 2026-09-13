import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const vanitasDominusRex: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "3vkxrw9462",
  slug: "vanitas-dominus-rex",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "3vkxrw9462:face:default",
      catalogId: "3vkxrw9462",
      name: "Vanitas, Dominus Rex",
      lineageName: "Vanitas",
      cost: {
        kind: "memory",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        level: 3,
        life: 25,
      },
      rulesText:
        "Vanitas Lineage\n\nYou may activate this card from your material deck. It costs 1 less to activate for every 3 damage your champion has dealt to other champions this turn.\n\nOn Champion Hit: Cards that opponent materializes cost 1 more to materialize until the beginning of your next turn. ",
      abilities: [
        {
          id: "3vkxrw9462-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Vanitas Lineage",
          keyword: {
            name: "lineage",
            lineageName: "Vanitas",
          },
        },
        {
          id: "3vkxrw9462-a2",
          kind: "static",
          staticKind: "effects",
          text: "You may activate this card from your material deck. It costs 1 less to activate for every 3 damage your champion has dealt to other champions this turn.",
          functionalZones: ["material-deck"],
          effects: [
            {
              kind: "rule-modification",
              mode: "allow",
              action: "activate",
              subject: {
                kind: "source",
              },
              fromZone: "material-deck",
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "memory",
              costOperation: "subtract",
              amount: {
                kind: "calculate",
                operator: "divide",
                operands: [
                  {
                    kind: "event-total",
                    event: {
                      name: "damage-dealt",
                      subject: {
                        kind: "event-object",
                        controller: "controller",
                        filter: {
                          kind: "type",
                          oneOf: ["CHAMPION"],
                        },
                      },
                      recipient: {
                        kind: "event-object",
                        controller: "opponent",
                        filter: {
                          kind: "type",
                          oneOf: ["CHAMPION"],
                        },
                      },
                    },
                    window: "this-turn",
                    metric: "event-amount",
                  },
                  3,
                ],
                rounding: "down",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "3vkxrw9462-a3",
          kind: "triggered",
          text: "On Champion Hit: Cards that opponent materializes cost 1 more to materialize until the beginning of your next turn.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
              recipient: {
                kind: "event-object",
                bindAs: "trigger-recipient",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
          },
          effect: {
            kind: "rule-modification",
            mode: "modify-cost",
            action: "materialize",
            subject: {
              kind: "player",
              player: "event-recipient-controller",
            },
            costKind: "memory",
            costOperation: "add",
            amount: 1,
            duration: {
              kind: "until-start-of-turn",
              whose: "controller",
            },
          },
        },
      ],
    },
  },
};

export default vanitasDominusRex;
