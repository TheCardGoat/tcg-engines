import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const summonSentinels: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5tlzsmw3rr",
  slug: "summon-sentinels",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5tlzsmw3rr:face:default",
      catalogId: "5tlzsmw3rr",
      name: "Summon Sentinels",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SKILL"],
      },
      elements: ["NEOS"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to activate for each domain you control.\n\nSummon two Automaton Drone tokens each with a buff counter on them.",
      abilities: [
        {
          id: "5tlzsmw3rr-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to activate for each domain you control.",
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
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "5tlzsmw3rr-a2",
          kind: "card-resolution",
          text: "Summon two Automaton Drone tokens each with a buff counter on them.",
          effect: {
            kind: "summon",
            object: "Automaton Drone",
            controller: "controller",
            bindResultAs: "summoned-token",
            amount: 2,
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

export default summonSentinels;
