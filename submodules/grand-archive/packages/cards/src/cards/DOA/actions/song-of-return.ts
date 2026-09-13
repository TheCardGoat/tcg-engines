import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const songOfReturn: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "MwXulmKsIg",
  slug: "song-of-return",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "MwXulmKsIg:face:default",
      catalogId: "MwXulmKsIg",
      name: "Song of Return",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SKILL", "MELODY"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to activate. (Apply this effect only if your champion's class matches this card's class.)\n\nReturn up to two target allies you control to their owner's hands.",
      abilities: [
        {
          id: "MwXulmKsIg-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to activate. (Apply this effect only if your champion's class matches this card's class.)",
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
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "MwXulmKsIg-a2",
          kind: "card-resolution",
          text: "Return up to two target allies you control to their owner's hands.",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 2,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "move",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            destination: {
              zone: "hand",
            },
          },
        },
      ],
    },
  },
};

export default songOfReturn;
