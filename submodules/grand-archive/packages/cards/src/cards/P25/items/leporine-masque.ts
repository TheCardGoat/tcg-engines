import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const leporineMasque: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "pgysz2zfji",
  slug: "leporine-masque",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "pgysz2zfji:face:default",
      catalogId: "pgysz2zfji",
      name: "Leporine Masque",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "(6), Banish Leoprine Masque: Draw a card into your memory. This ability costs (X) less to activate, where X is the amount of omens you have. (An omen is a card in a banishment with an omen counter on it.)",
      abilities: [
        {
          id: "pgysz2zfji-a1",
          kind: "activated",
          text: "(6), Banish Leoprine Masque: Draw a card into your memory. This ability costs (X) less to activate, where X is the amount of omens you have. (An omen is a card in a banishment with an omen counter on it.)",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 6,
              },
              {
                kind: "banish-self",
              },
            ],
          },
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "player-property",
                player: "controller",
                property: "omens",
              },
            },
          ],
          costModifiers: [
            {
              operation: "subtract",
              amount: {
                kind: "player-property",
                player: "controller",
                property: "omens",
              },
            },
          ],
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
      ],
    },
  },
};

export default leporineMasque;
