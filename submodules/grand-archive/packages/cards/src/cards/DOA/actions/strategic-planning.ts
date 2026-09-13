import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const strategicPlanning: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "EtIGAJ8sxw",
  slug: "strategic-planning",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "EtIGAJ8sxw:face:default",
      catalogId: "EtIGAJ8sxw",
      name: "Strategic Planning",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Glimpse 2. Put a preparation counter on your champion. (To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order.)",
      abilities: [
        {
          id: "EtIGAJ8sxw-a1",
          kind: "card-resolution",
          text: "Glimpse 2. Put a preparation counter on your champion. (To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order.)",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "keyword-action",
                action: "glimpse",
                amount: 2,
              },
              {
                kind: "add-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: "preparation",
                amount: 1,
              },
            ],
          },
        },
      ],
    },
  },
};

export default strategicPlanning;
