import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const diamondRibbon: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "lVvU9lpJ3M",
  slug: "diamond-ribbon",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "lVvU9lpJ3M:face:default",
      catalogId: "lVvU9lpJ3M",
      name: "Diamond Ribbon",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "SUITED", "ACCESSORY"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "(4), Banish Diamond Ribbon: Generate up to two Bolt of Diamonds cards and put them into your memory. This ability costs (1) less to activate for each Suited object you control with different reserve costs.",
      abilities: [
        {
          id: "lVvU9lpJ3M-a1",
          kind: "activated",
          text: "(4), Banish Diamond Ribbon: Generate up to two Bolt of Diamonds cards and put them into your memory. This ability costs (1) less to activate for each Suited object you control with different reserve costs.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 4,
              },
              {
                kind: "banish-self",
              },
            ],
          },
          variables: [
            {
              symbol: "X",
              kind: "chosen",
              minimum: 0,
              maximum: 2,
            },
          ],
          costModifiers: [
            {
              operation: "subtract",
              amount: {
                kind: "count",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "subtype",
                    oneOf: ["SUITED"],
                  },
                },
                distinctBy: "reserve-cost",
              },
            },
          ],
          effect: {
            kind: "generate",
            card: "Bolt of Diamonds",
            player: "controller",
            destination: {
              zone: "memory",
            },
            amount: {
              kind: "variable",
              symbol: "X",
            },
          },
        },
      ],
    },
  },
};

export default diamondRibbon;
