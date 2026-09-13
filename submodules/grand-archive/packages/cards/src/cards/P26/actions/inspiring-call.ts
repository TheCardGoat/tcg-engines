import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const inspiringCall: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "k71PE3clOI",
  slug: "inspiring-call",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "k71PE3clOI:face:default",
      catalogId: "k71PE3clOI",
      name: "Inspiring Call",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SKILL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "This card costs 2 less to activate if your champion has attacked this turn.\n\nAllies you control get +1 POWER until end of turn. Draw a card into your memory.",
      abilities: [
        {
          id: "k71PE3clOI-a1",
          kind: "static",
          staticKind: "effects",
          text: "This card costs 2 less to activate if your champion has attacked this turn.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "history",
                event: "attack-declared",
                window: "this-turn",
                actor: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
                minimum: 1,
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "k71PE3clOI-a2",
          kind: "card-resolution",
          text: "Allies you control get +1 POWER until end of turn. Draw a card into your memory.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "continuous",
                subjects: {
                  kind: "each",
                  collection: {
                    zones: ["field"],
                    player: "controller",
                    filter: {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                  },
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
                  property: "power",
                  operation: "add",
                  amount: 1,
                },
              },
              {
                kind: "draw",
                player: "controller",
                amount: 1,
                to: "memory",
              },
            ],
          },
        },
      ],
    },
  },
};

export default inspiringCall;
