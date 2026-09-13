import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const totalWhiteout: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "O4mD40xpbY",
  slug: "total-whiteout",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "O4mD40xpbY:face:default",
      catalogId: "O4mD40xpbY",
      name: "Total Whiteout",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["PHANTASIA"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 3 less to activate.\n\nObjects you don't control enter the field rested.\n\nRested non-champion objects you don't control lose all activated abilities and can't be used for an attack.\n\nAt the beginning of your main phase, cascade—\n• 1—  Pay (4) or sacrifice Total Whiteout. \n• 2— Sacrifice Total Whiteout.",
      abilities: [
        {
          id: "O4mD40xpbY-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 3 less to activate.",
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
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
              amount: 3,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "O4mD40xpbY-a2",
          kind: "static",
          staticKind: "effects",
          text: "Objects you don't control enter the field rested.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "object-entered-field",
                subject: {
                  kind: "event-object",
                  controller: "opponent",
                },
              },
              operation: {
                kind: "modify-object-state",
                state: "rested",
                value: true,
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "O4mD40xpbY-a3",
          kind: "static",
          staticKind: "effects",
          text: "Rested non-champion objects you don't control lose all activated abilities and can't be used for an attack.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "each-opponent",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "not",
                        filter: {
                          kind: "type",
                          oneOf: ["CHAMPION"],
                        },
                      },
                      {
                        kind: "object-state",
                        state: "rested",
                      },
                    ],
                  },
                },
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "remove-abilities",
                filter: {
                  abilityKinds: ["activated"],
                },
              },
            },
            {
              kind: "rule-modification",
              mode: "forbid",
              action: "use-for-attack",
              subject: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "each-opponent",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "not",
                        filter: {
                          kind: "type",
                          oneOf: ["CHAMPION"],
                        },
                      },
                      {
                        kind: "object-state",
                        state: "rested",
                      },
                    ],
                  },
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "O4mD40xpbY-a4",
          kind: "triggered",
          text: "At the beginning of your main phase, cascade—\n• 1—  Pay (4) or sacrifice Total Whiteout.\n• 2— Sacrifice Total Whiteout.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "main",
              actor: "controller",
            },
          },
          cascade: {
            kind: "cascade",
            advanceOn: "trigger",
            tracking: {
              scope: "source-instance",
              includesCurrent: true,
              advancesIfStackEntryFailsToResolve: true,
            },
            copiedAbility: "repeat-pending-effect-without-advancing",
            modes: [
              {
                id: "cascade-1",
                text: "Pay (4) or sacrifice Total Whiteout.",
                counts: [1],
                effect: {
                  kind: "unless-paid",
                  player: "controller",
                  cost: {
                    kind: "pay-reserve",
                    amount: 4,
                  },
                  otherwise: {
                    kind: "sacrifice",
                    subject: {
                      kind: "source",
                    },
                  },
                },
              },
              {
                id: "cascade-2",
                text: "Sacrifice Total Whiteout.",
                counts: [2],
                effect: {
                  kind: "sacrifice",
                  subject: {
                    kind: "source",
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

export default totalWhiteout;
