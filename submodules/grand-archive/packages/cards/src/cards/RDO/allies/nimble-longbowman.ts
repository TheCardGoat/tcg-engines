import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const nimbleLongbowman: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "tMy4zMpqcH",
  slug: "nimble-longbowman",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "tMy4zMpqcH:face:default",
      catalogId: "tMy4zMpqcH",
      name: "Nimble Longbowman",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText:
        "Fast Activation, Ranged 1\n\n[Class Bonus] Nimble Longbowman enters the field distant.\n\nOn Enter: Your champion becomes distant. (Units stay distant until the end of their controller's turn.)",
      abilities: [
        {
          id: "tMy4zMpqcH-a1",
          kind: "keyword-group",
          text: "Fast Activation, Ranged 1",
          keywords: [
            {
              name: "fast-activation",
            },
            {
              name: "ranged",
              value: 1,
            },
          ],
        },
        {
          id: "tMy4zMpqcH-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Nimble Longbowman enters the field distant.",
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
              kind: "replacement",
              event: {
                name: "object-entered-field",
                subject: {
                  kind: "source",
                },
              },
              operation: {
                kind: "modify-object-state",
                state: "distant",
                value: true,
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "tMy4zMpqcH-a3",
          kind: "triggered",
          text: "On Enter: Your champion becomes distant. (Units stay distant until the end of their controller's turn.)",
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
            kind: "set-object-state",
            subject: {
              kind: "champion",
              player: "controller",
            },
            state: "distant",
            value: true,
          },
        },
      ],
    },
  },
};

export default nimbleLongbowman;
