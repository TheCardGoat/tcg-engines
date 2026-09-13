import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lesserBoonOfFractals: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "j0zgnD8pP5",
  slug: "lesser-boon-of-fractals",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "j0zgnD8pP5:face:default",
      catalogId: "j0zgnD8pP5",
      name: "Lesser Boon of Fractals",
      cost: {
        kind: "reserve",
        amount: 10,
      },
      typeLine: {
        supertypes: [],
        types: ["LESSER BOON"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["WATER"],
      speed: "slow",
      stats: {},
      rulesText:
        "This boon costs 3 less to bestow for each Fractal you control.\n\nAs you gain this boon, summon two Core Fractal tokens rested.",
      abilities: [
        {
          id: "j0zgnD8pP5-a1",
          kind: "static",
          staticKind: "effects",
          text: "This boon costs 3 less to bestow for each Fractal you control.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "bestow",
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
                        kind: "subtype",
                        oneOf: ["FRACTAL"],
                      },
                    },
                  },
                  3,
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "j0zgnD8pP5-a2",
          kind: "triggered",
          text: "As you gain this boon, summon two Core Fractal tokens rested.",
          trigger: {
            kind: "event",
            event: {
              name: "boon-gained",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "summon",
            object: "Core Fractal",
            controller: "controller",
            bindResultAs: "summoned-token",
            amount: 2,
            entersWithStates: ["rested"],
          },
        },
      ],
    },
  },
};

export default lesserBoonOfFractals;
