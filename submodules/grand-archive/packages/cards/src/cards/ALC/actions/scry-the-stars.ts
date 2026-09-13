import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const scryTheStars: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "oz23yfzk96",
  slug: "scry-the-stars",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "oz23yfzk96:face:default",
      catalogId: "oz23yfzk96",
      name: "Scry the Stars",
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
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] You may banish a card named Scry the Skies from your graveyard rather than pay this card's reserve cost.\n\nUntil end of turn, cards you look at while glimpsing have \"Starcalling — (X)\", where X is that card's reserve cost. Glimpse 3.",
      abilities: [
        {
          id: "oz23yfzk96-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] You may banish a card named Scry the Skies from your graveyard rather than pay this card's reserve cost.",
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
              mode: "replace-cost",
              action: "pay-cost",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              cost: {
                kind: "select-and-move",
                player: "controller",
                from: "graveyard",
                to: "banishment",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                filter: {
                  kind: "name",
                  value: "Scry the Skies",
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "oz23yfzk96-a2",
          kind: "card-resolution",
          text: 'Until end of turn, cards you look at while glimpsing have "Starcalling — (X)", where X is that card\'s reserve cost. Glimpse 3.',
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "rule-modification",
                mode: "grant-keyword",
                action: "glimpse",
                subject: {
                  kind: "player",
                  player: "controller",
                },
                grantedKeyword: {
                  name: "starcalling",
                  cost: {
                    kind: "pay-reserve",
                    amount: {
                      kind: "property",
                      subject: {
                        kind: "candidate",
                      },
                      property: "reserve-cost",
                      basis: "base",
                    },
                  },
                },
                duration: {
                  kind: "this-turn",
                },
              },
              {
                kind: "keyword-action",
                action: "glimpse",
                player: "controller",
                amount: 3,
              },
            ],
          },
        },
      ],
    },
  },
};

export default scryTheStars;
