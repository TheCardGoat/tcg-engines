import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tidebreakerSentinel: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "3kwkn38b7v",
  slug: "tidebreaker-sentinel",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "3kwkn38b7v:face:default",
      catalogId: "3kwkn38b7v",
      name: "Tidebreaker Sentinel",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 0,
        life: 3,
      },
      rulesText:
        "[Class Bonus] Foster\n\nOn Foster: Put the top three cards of your deck into your graveyard.\n\nAs long as Tidebreaker Sentinel is fostered, it gets +2 LIFE and has taunt.",
      abilities: [
        {
          id: "3kwkn38b7v-a1",
          kind: "triggered",
          intrinsic: true,
          text: "[Class Bonus] Foster",
          keyword: {
            name: "foster",
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
        },
        {
          id: "3kwkn38b7v-a2",
          kind: "triggered",
          text: "On Foster: Put the top three cards of your deck into your graveyard.",
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
            kind: "mill",
            player: "controller",
            amount: 3,
          },
        },
        {
          id: "3kwkn38b7v-a3",
          kind: "static",
          staticKind: "effects",
          text: "As long as Tidebreaker Sentinel is fostered, it gets +2 LIFE and has taunt.",
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
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "life",
                operation: "add",
                amount: 2,
              },
            },
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
                  name: "taunt",
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default tidebreakerSentinel;
