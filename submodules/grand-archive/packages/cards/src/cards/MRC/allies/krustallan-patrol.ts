import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const krustallanPatrol: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "8sugly4wif",
  slug: "krustallan-patrol",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "8sugly4wif:face:default",
      catalogId: "8sugly4wif",
      name: "Krustallan Patrol",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText:
        "Foster\n\nOn Foster: Put a buff counter on Krustallan Patrol.\n\nAs long as Krustallan Patrol is fostered, it has steadfast. (An ally with steadfast can retaliate while rested and doesn’t rest to do so.)",
      abilities: [
        {
          id: "8sugly4wif-a1",
          kind: "triggered",
          intrinsic: true,
          text: "Foster",
          keyword: {
            name: "foster",
          },
        },
        {
          id: "8sugly4wif-a2",
          kind: "triggered",
          text: "On Foster: Put a buff counter on Krustallan Patrol.",
          trigger: {
            kind: "event",
            event: {
              name: "object-fostered",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: "buff",
            amount: 1,
          },
        },
        {
          id: "8sugly4wif-a3",
          kind: "static",
          staticKind: "effects",
          text: "As long as Krustallan Patrol is fostered, it has steadfast. (An ally with steadfast can retaliate while rested and doesn’t rest to do so.)",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "object-state",
                subject: {
                  kind: "source",
                },
                state: "fostered",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "steadfast",
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default krustallanPatrol;
