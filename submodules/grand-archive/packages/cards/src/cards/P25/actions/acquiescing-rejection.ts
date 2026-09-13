import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const acquiescingRejection: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qwtprd5b5r",
  slug: "acquiescing-rejection",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qwtprd5b5r:face:default",
      catalogId: "qwtprd5b5r",
      name: "Acquiescing Rejection",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL", "REACTION"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to activate.\n\nNegate target card activation you don't control unless its controller has you draw two cards. Banish the card that had its activation negated this way.",
      abilities: [
        {
          id: "qwtprd5b5r-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to activate.",
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
          id: "qwtprd5b5r-a2",
          kind: "card-resolution",
          text: "Negate target card activation you don't control unless its controller has you draw two cards. Banish the card that had its activation negated this way.",
          targets: [
            {
              id: "target-activation",
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
                controller: "opponent",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "unless-performed",
                player: {
                  controllerOf: "target-activation",
                },
                alternative: {
                  kind: "draw",
                  player: "controller",
                  amount: 2,
                },
                otherwise: {
                  kind: "negate",
                  subject: {
                    kind: "bound",
                    binding: "target-activation",
                  },
                  bindResultAs: "negated-activation",
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "effect-succeeded",
                  binding: "negated-activation",
                },
                then: {
                  kind: "banish-object",
                  subject: {
                    kind: "stack-source",
                    binding: "target-activation",
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default acquiescingRejection;
