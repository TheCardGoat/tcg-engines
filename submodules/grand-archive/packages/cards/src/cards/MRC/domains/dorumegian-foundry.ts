import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const dorumegianFoundry: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "CzwVavXMQU",
  slug: "dorumegian-foundry",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "CzwVavXMQU:face:default",
      catalogId: "CzwVavXMQU",
      name: "Dorumegian Foundry",
      cost: {
        kind: "reserve",
        amount: 8,
      },
      typeLine: {
        supertypes: [],
        types: ["DOMAIN"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "FACTORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 2 less to activate for each of up to three domains you control.\n\nOn Enter: Summon an Automaton Drone token with a buff counter on it.",
      abilities: [
        {
          id: "CzwVavXMQU-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 2 less to activate for each of up to three domains you control.",
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
              amount: {
                kind: "calculate",
                operator: "multiply",
                operands: [
                  {
                    kind: "count",
                    collection: {
                      zones: ["field"],
                      player: "controller",
                      filter: {
                        kind: "type",
                        oneOf: ["DOMAIN"],
                      },
                    },
                  },
                  2,
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "CzwVavXMQU-a2",
          kind: "triggered",
          text: "On Enter: Summon an Automaton Drone token with a buff counter on it.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "summon",
            object: "Automaton Drone",
            controller: "controller",
            bindResultAs: "summoned-token",
            entersWithCounters: [
              {
                counter: "buff",
                amount: 1,
              },
            ],
          },
        },
      ],
    },
  },
};

export default dorumegianFoundry;
