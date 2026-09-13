import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const halcyonPrism: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "997vxajn2q",
  slug: "halcyon-prism",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "997vxajn2q:face:default",
      catalogId: "997vxajn2q",
      name: "Halcyon Prism",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "BAUBLE"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Banish Halcyon Prism: Glimpse 3. (To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order.)",
      abilities: [
        {
          id: "997vxajn2q-a1",
          kind: "activated",
          text: "Banish Halcyon Prism: Glimpse 3. (To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order.)",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          effect: {
            kind: "keyword-action",
            action: "glimpse",
            amount: 3,
          },
        },
      ],
    },
  },
};

export default halcyonPrism;
