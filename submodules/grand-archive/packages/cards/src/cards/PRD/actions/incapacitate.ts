import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const incapacitate: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "szene5o32m",
  slug: "incapacitate",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "szene5o32m:face:default",
      catalogId: "szene5o32m",
      name: "Incapacitate",
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
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 2 less to activate. (Apply this effect only if your champion's class matches this card's class.)\n\nNegate target action card activation.",
      abilities: [
        {
          id: "szene5o32m-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 2 less to activate. (Apply this effect only if your champion's class matches this card's class.)",
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
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "szene5o32m-a2",
          kind: "card-resolution",
          text: "Negate target action card activation.",
          targets: [
            {
              id: "target-stack-item",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "stack-item",
                itemTypes: ["card-activation"],
                sourceFilter: {
                  kind: "type",
                  oneOf: ["ACTION"],
                },
              },
            },
          ],
          effect: {
            kind: "negate",
            subject: {
              kind: "bound",
              binding: "target-stack-item",
            },
            bindResultAs: "negated-stack-item",
          },
        },
      ],
    },
  },
};

export default incapacitate;
