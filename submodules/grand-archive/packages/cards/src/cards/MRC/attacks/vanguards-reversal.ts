import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const vanguardsReversal: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vghJqNdG8F",
  slug: "vanguards-reversal",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vghJqNdG8F:face:default",
      catalogId: "vghJqNdG8F",
      name: "Vanguard's Reversal",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SWORD"],
      },
      elements: ["NORM"],
      stats: {
        power: 5,
      },
      rulesText:
        "[Class Bonus] As long as your champion has taunt, this card costs 3 less to activate. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "vghJqNdG8F-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] As long as your champion has taunt, this card costs 3 less to activate. (Apply this effect only if your champion's class matches this card's class.)",
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
              condition: {
                kind: "subject-matches",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                filter: {
                  kind: "has-keyword",
                  keyword: "taunt",
                },
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 3,
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

export default vanguardsReversal;
