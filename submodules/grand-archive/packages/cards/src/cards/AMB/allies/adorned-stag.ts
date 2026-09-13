import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const adornedStag: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4gdubtwij9",
  slug: "adorned-stag",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4gdubtwij9:face:default",
      catalogId: "4gdubtwij9",
      name: "Adorned Stag",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "DEER"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "[Class Bonus] This card costs 1 less to activate. (Apply this effect only if your champion’s class matches this card’s class.)",
      abilities: [
        {
          id: "4gdubtwij9-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to activate. (Apply this effect only if your champion’s class matches this card’s class.)",
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
      ],
    },
  },
};

export default adornedStag;
