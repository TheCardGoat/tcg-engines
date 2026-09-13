import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const blindingOrb: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qYH9PJP7uM",
  slug: "blinding-orb",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qYH9PJP7uM:face:default",
      catalogId: "qYH9PJP7uM",
      name: "Blinding Orb",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "BAUBLE"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Banish Blinding Orb: Each opponent puts two cards from their hand into their memory. Class Bonus: Draw a card. (Apply the additional effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "qYH9PJP7uM-a1",
          kind: "activated",
          text: "Banish Blinding Orb: Each opponent puts two cards from their hand into their memory. Class Bonus: Draw a card. (Apply the additional effect only if your champion's class matches this card's class.)",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "reserve",
                player: "each-opponent",
                selection: {
                  id: "opponent-hand-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "each-opponent",
                  count: {
                    kind: "exactly",
                    amount: 2,
                  },
                  unique: true,
                  candidates: {
                    kind: "card",
                    zones: ["hand"],
                    relationship: "zone-of",
                    player: "each-opponent",
                  },
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "champion-matches-source",
                  characteristic: "class",
                },
                then: {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default blindingOrb;
