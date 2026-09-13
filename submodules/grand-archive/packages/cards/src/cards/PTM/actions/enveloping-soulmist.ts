import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const envelopingSoulmist: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "kYG1EDltdI",
  slug: "enveloping-soulmist",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "kYG1EDltdI:face:default",
      catalogId: "kYG1EDltdI",
      name: "Enveloping Soulmist",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SKILL", "REACTION"],
      },
      elements: ["CRUX"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] As long as your champion is awake, this card costs 2 less to activate.\n\nYour champion gains stealth until end of turn. Put a preparation counter on your champion.",
      abilities: [
        {
          id: "kYG1EDltdI-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] As long as your champion is awake, this card costs 2 less to activate.",
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
              condition: {
                kind: "object-state",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                state: "awake",
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
          id: "kYG1EDltdI-a2",
          kind: "card-resolution",
          text: "Your champion gains stealth until end of turn. Put a preparation counter on your champion.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "continuous",
                subjects: {
                  kind: "champion",
                  player: "controller",
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
              {
                kind: "add-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: "preparation",
                amount: 1,
              },
            ],
          },
        },
      ],
    },
  },
};

export default envelopingSoulmist;
