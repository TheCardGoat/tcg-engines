import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const aegisOfDawn: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "abipl6gt7l",
  slug: "aegis-of-dawn",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "abipl6gt7l:face:default",
      catalogId: "abipl6gt7l",
      name: "Aegis of Dawn",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SHIELD"],
      },
      elements: ["NEOS"],
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to materialize.\n\nWhenever your champion is dealt four or more damage, summon an Automaton Drone Drone token.",
      abilities: [
        {
          id: "abipl6gt7l-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to materialize.",
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
              action: "materialize",
              subject: {
                kind: "source",
              },
              costKind: "memory",
              costOperation: "subtract",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "abipl6gt7l-a2",
          kind: "triggered",
          text: "Whenever your champion is dealt four or more damage, summon an Automaton Drone Drone token.",
          trigger: {
            kind: "event",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
              amountComparison: {
                left: {
                  kind: "event-amount",
                },
                operator: "gte",
                right: 4,
              },
            },
          },
          effect: {
            kind: "summon",
            object: "Automaton Drone Drone",
            controller: "controller",
            bindResultAs: "summoned-token",
          },
        },
      ],
    },
  },
};

export default aegisOfDawn;
