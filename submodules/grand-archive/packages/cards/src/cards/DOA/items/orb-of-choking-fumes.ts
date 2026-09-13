import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const orbOfChokingFumes: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "llQe0cg4xJ",
  slug: "orb-of-choking-fumes",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "llQe0cg4xJ:face:default",
      catalogId: "llQe0cg4xJ",
      name: "Orb of Choking Fumes",
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
        "Banish Orb of Choking Fumes: Cards your opponents activate this turn cost 1 more to activate. Class Bonus: Draw a card. (Apply the additional effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "llQe0cg4xJ-a1",
          kind: "activated",
          text: "Banish Orb of Choking Fumes: Cards your opponents activate this turn cost 1 more to activate. Class Bonus: Draw a card. (Apply the additional effect only if your champion's class matches this card's class.)",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "rule-modification",
                mode: "modify-cost",
                action: "activate",
                subject: {
                  kind: "player",
                  player: "each-opponent",
                },
                costKind: "reserve",
                costOperation: "add",
                amount: 1,
                duration: {
                  kind: "this-turn",
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

export default orbOfChokingFumes;
