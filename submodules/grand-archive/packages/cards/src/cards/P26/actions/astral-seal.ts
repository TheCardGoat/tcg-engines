import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const astralSeal: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "e3aebjvwbc",
  slug: "astral-seal",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "e3aebjvwbc:face:default",
      catalogId: "e3aebjvwbc",
      name: "Astral Seal",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["ASTRA"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 3 less to activate if it targets an activation of a card with the same name as a card in any banishment.\n\nNegate target card activation. Banish the card that had its activation negated this way.",
      abilities: [
        {
          id: "e3aebjvwbc-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 3 less to activate if it targets an activation of a card with the same name as a card in any banishment.",
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
              amount: 3,
              condition: {
                kind: "ability-target-characteristic-in-collection",
                ability: "this",
                characteristic: "card-name",
                collection: {
                  zones: ["banishment"],
                  player: "each-player",
                },
                quantifier: "any",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "e3aebjvwbc-a2",
          kind: "card-resolution",
          text: "Negate target card activation. Banish the card that had its activation negated this way.",
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
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "negate",
                subject: {
                  kind: "bound",
                  binding: "target-stack-item",
                },
                bindResultAs: "negated-stack-item",
              },
              {
                kind: "banish-object",
                subject: {
                  kind: "stack-source",
                  binding: "negated-stack-item",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default astralSeal;
