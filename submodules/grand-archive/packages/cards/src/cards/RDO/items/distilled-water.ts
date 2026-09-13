import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const distilledWater: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "O1OU62Zx2Y",
  slug: "distilled-water",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "O1OU62Zx2Y:face:default",
      catalogId: "O1OU62Zx2Y",
      name: "Distilled Water",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "POTION"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Brew — One Herb\n\nSacrifice Distilled Water: If Distilled Water was brewed, draw a card.",
      abilities: [
        {
          id: "O1OU62Zx2Y-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Brew — One Herb",
          keyword: {
            name: "brew",
            requirements: [
              {
                kind: "subtype",
                value: "Herb",
                count: 1,
              },
            ],
          },
        },
        {
          id: "O1OU62Zx2Y-a2",
          kind: "activated",
          text: "Sacrifice Distilled Water: If Distilled Water was brewed, draw a card.",
          activation: "ability",
          cost: {
            kind: "sacrifice",
            subject: {
              kind: "source",
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "activation-state",
              state: "brewed",
            },
            then: {
              kind: "draw",
              player: "controller",
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default distilledWater;
