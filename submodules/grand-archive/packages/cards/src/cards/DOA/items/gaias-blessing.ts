import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const gaiasBlessing: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ymhDYTPfi1",
  slug: "gaias-blessing",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ymhDYTPfi1:face:default",
      catalogId: "ymhDYTPfi1",
      name: "Gaia's Blessing",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BAUBLE"],
      },
      elements: ["TERA"],
      stats: {},
      rulesText:
        "[Element Bonus] You may banish four Animal and/or Beast ally cards from your graveyard to activate this card from your material deck without paying its costs. \n\nPlay with the top card of your deck revealed.\n\nYou may activate Animal and Beast ally cards from the top of your deck.",
      abilities: [
        {
          id: "ymhDYTPfi1-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Element Bonus] You may banish four Animal and/or Beast ally cards from your graveyard to activate this card from your material deck without paying its costs.",
          restrictions: [
            {
              kind: "static",
              name: "element-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "element",
              },
            },
          ],
          effects: [
            {
              kind: "rule-modification",
              mode: "allow",
              action: "activate",
              subject: {
                kind: "source",
              },
              fromZone: "material-deck",
              cost: {
                kind: "select-and-move",
                player: "controller",
                from: "graveyard",
                to: "banishment",
                count: {
                  kind: "exactly",
                  amount: 4,
                },
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "any",
                      filters: [
                        {
                          kind: "subtype",
                          oneOf: ["ANIMAL"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["BEAST"],
                        },
                      ],
                    },
                  ],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
            {
              kind: "rule-modification",
              mode: "replace-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              fromZone: "material-deck",
              cost: {
                kind: "pay-reserve",
                amount: 0,
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "ymhDYTPfi1-a2",
          kind: "static",
          staticKind: "effects",
          text: "Play with the top card of your deck revealed.",
          effects: [
            {
              kind: "continuous-player-state",
              players: "controller",
              state: {
                named: "top-main-deck-revealed",
              },
              value: true,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "ymhDYTPfi1-a3",
          kind: "static",
          staticKind: "effects",
          text: "You may activate Animal and Beast ally cards from the top of your deck.",
          effects: [
            {
              kind: "rule-modification",
              mode: "allow",
              action: "activate",
              subject: {
                kind: "player",
                player: "controller",
              },
              filter: {
                kind: "all",
                filters: [
                  {
                    kind: "type",
                    oneOf: ["ALLY"],
                  },
                  {
                    kind: "any",
                    filters: [
                      {
                        kind: "subtype",
                        oneOf: ["ANIMAL"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["BEAST"],
                      },
                    ],
                  },
                ],
              },
              fromZone: "main-deck",
              fromTopOfDeck: true,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default gaiasBlessing;
