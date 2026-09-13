import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const corhaziArsonist: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "0ejcyuvuxn",
  slug: "corhazi-arsonist",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "0ejcyuvuxn:face:default",
      catalogId: "0ejcyuvuxn",
      name: "Corhazi Arsonist",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "Remove a preparation counter from your champion: Corhazi Arsonist gains stealth until end of turn.\n\nIf a unit hit by Corhazi Arsonist this turn would die, banish it instead.",
      abilities: [
        {
          id: "0ejcyuvuxn-a1",
          kind: "activated",
          text: "Remove a preparation counter from your champion: Corhazi Arsonist gains stealth until end of turn.",
          activation: "ability",
          cost: {
            kind: "remove-counter",
            subject: {
              kind: "champion",
              player: "controller",
            },
            counter: "preparation",
            amount: 1,
          },
          effect: {
            kind: "continuous",
            subjects: {
              kind: "source",
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
            },
            layer: {
              layer: "D",
              modifies: "ability",
            },
            change: {
              kind: "grant-keyword",
              keyword: {
                name: "stealth",
              },
            },
          },
        },
        {
          id: "0ejcyuvuxn-a2",
          kind: "static",
          staticKind: "effects",
          text: "If a unit hit by Corhazi Arsonist this turn would die, banish it instead.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "object-died",
                subject: {
                  kind: "event-object",
                  filter: {
                    kind: "type",
                    oneOf: ["ALLY", "CHAMPION"],
                  },
                },
              },
              condition: {
                kind: "history",
                event: "attack-hit",
                window: "this-turn",
                source: {
                  kind: "source",
                },
                subject: {
                  kind: "event-subject",
                },
              },
              operation: {
                kind: "replace-with",
                effect: {
                  kind: "banish-object",
                  subject: {
                    kind: "event-subject",
                  },
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default corhaziArsonist;
