import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const gloweringConflagration: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "1ym2py8u7q",
  slug: "glowering-conflagration",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "1ym2py8u7q:face:default",
      catalogId: "1ym2py8u7q",
      name: "Glowering Conflagration",
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
      elements: ["FIRE"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] Kindle 3 (You may banish up to three fire element cards from your graveyard as you activate this card. Each one pays for (1) of this card's cost.)\n\nDeal 1+X damage to target champion, where X is the amount of phantasias you control.",
      abilities: [
        {
          id: "1ym2py8u7q-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Kindle 3 (You may banish up to three fire element cards from your graveyard as you activate this card. Each one pays for (1) of this card's cost.)",
          keyword: {
            name: "kindle",
            value: 3,
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
          id: "1ym2py8u7q-a2",
          kind: "card-resolution",
          text: "Deal 1+X damage to target champion, where X is the amount of phantasias you control.",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
          ],
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "count",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["PHANTASIA"],
                  },
                },
              },
            },
          ],
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "bound",
              binding: "target-1",
            },
            amount: {
              kind: "calculate",
              operator: "add",
              operands: [
                1,
                {
                  kind: "variable",
                  symbol: "X",
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default gloweringConflagration;
