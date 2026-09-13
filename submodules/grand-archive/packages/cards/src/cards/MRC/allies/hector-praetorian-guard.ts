import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const hectorPraetorianGuard: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "AsDKTmP3kp",
  slug: "hector-praetorian-guard",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "AsDKTmP3kp:face:default",
      catalogId: "AsDKTmP3kp",
      name: "Hector, Praetorian Guard",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["NEOS"],
      stats: {
        power: 3,
        life: 3,
      },
      rulesText:
        "Imbue 3\n\n[Class Bonus] On Enter: If Hector is imbued, summon two Automaton Drone tokens.\n\n[Class Bonus] If damage would be dealt to one or more non-token neos element units you control, prevent X of that damage where X is the amount of tokens you control. Apply this replacement effect only once per turn.",
      abilities: [
        {
          id: "AsDKTmP3kp-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Imbue 3",
          keyword: {
            name: "imbue",
            value: 3,
            elementRequirement: "source-elements",
          },
        },
        {
          id: "AsDKTmP3kp-a2",
          kind: "triggered",
          text: "[Class Bonus] On Enter: If Hector is imbued, summon two Automaton Drone tokens.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
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
          effect: {
            kind: "conditional",
            condition: {
              kind: "activation-state",
              state: "imbued",
            },
            then: {
              kind: "summon",
              object: "Automaton Drone",
              controller: "controller",
              bindResultAs: "summoned-token",
              amount: 2,
            },
          },
        },
        {
          id: "AsDKTmP3kp-a3",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] If damage would be dealt to one or more non-token neos element units you control, prevent X of that damage where X is the amount of tokens you control. Apply this replacement effect only once per turn.",
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
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "count",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "token",
                    value: true,
                  },
                },
              },
            },
          ],
          effects: [
            {
              kind: "replacement",
              event: {
                name: "damage-dealt",
                recipient: {
                  kind: "event-object",
                  controller: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "element",
                        oneOf: ["NEOS"],
                      },
                      {
                        kind: "type",
                        oneOf: ["ALLY", "CHAMPION"],
                      },
                      {
                        kind: "token",
                        value: false,
                      },
                    ],
                  },
                },
              },
              operation: {
                kind: "prevent",
                amount: {
                  kind: "variable",
                  symbol: "X",
                },
              },
              duration: {
                kind: "while-source-on-field",
              },
              limit: {
                count: 1,
                per: "turn",
              },
            },
          ],
        },
      ],
    },
  },
};

export default hectorPraetorianGuard;
