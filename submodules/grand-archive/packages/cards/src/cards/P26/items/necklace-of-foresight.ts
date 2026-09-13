import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const necklaceOfForesight: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "lq2kkvoqk1",
  slug: "necklace-of-foresight",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "lq2kkvoqk1:face:default",
      catalogId: "lq2kkvoqk1",
      name: "Necklace of Foresight",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to materialize.\n\nBanish Necklace of Foresight: Glimpse 4. (To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order.)",
      abilities: [
        {
          id: "lq2kkvoqk1-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to materialize.",
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
              action: "materialize",
              subject: {
                kind: "source",
              },
              costKind: "memory",
              costOperation: "subtract",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "lq2kkvoqk1-a2",
          kind: "activated",
          text: "Banish Necklace of Foresight: Glimpse 4. (To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order.)",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          effect: {
            kind: "keyword-action",
            action: "glimpse",
            amount: 4,
          },
        },
      ],
    },
  },
};

export default necklaceOfForesight;
