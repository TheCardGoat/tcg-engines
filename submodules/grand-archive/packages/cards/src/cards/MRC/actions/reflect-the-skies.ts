import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const reflectTheSkies: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "67duh1cy3g",
  slug: "reflect-the-skies",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "67duh1cy3g:face:default",
      catalogId: "67duh1cy3g",
      name: "Reflect the Skies",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SKILL"],
      },
      elements: ["ASTRA"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to activate. \n\nPut the bottom four cards of your deck on top of your deck in a random order. Glimpse 2.",
      abilities: [
        {
          id: "67duh1cy3g-a1",
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
          id: "67duh1cy3g-a2",
          kind: "card-resolution",
          text: "Put the bottom four cards of your deck on top of your deck in a random order. Glimpse 2.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "choose",
                selection: {
                  id: "moved-bottom-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 4,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["main-deck"],
                    relationship: "zone-of",
                    player: "controller",
                    fromBottom: true,
                  },
                },
                effect: {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "moved-bottom-cards",
                  },
                  from: "main-deck",
                  destination: {
                    zone: "main-deck",
                    placement: {
                      kind: "top",
                      order: {
                        kind: "random",
                      },
                    },
                  },
                },
              },
              {
                kind: "keyword-action",
                action: "glimpse",
                amount: 2,
              },
            ],
          },
        },
      ],
    },
  },
};

export default reflectTheSkies;
