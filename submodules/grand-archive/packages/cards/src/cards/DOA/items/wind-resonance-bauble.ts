import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const windResonanceBauble: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "bHGUNMFLg9",
  slug: "wind-resonance-bauble",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "bHGUNMFLg9:face:default",
      catalogId: "bHGUNMFLg9",
      name: "Wind Resonance Bauble",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "BAUBLE"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Banish Wind Resonance Bauble: Draw a card. Activate this ability only if an opponent controls a wind element champion.",
      abilities: [
        {
          id: "bHGUNMFLg9-a1",
          kind: "activated",
          text: "Banish Wind Resonance Bauble: Draw a card. Activate this ability only if an opponent controls a wind element champion.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          condition: {
            kind: "collection-exists",
            collection: {
              zones: ["field"],
              player: "each-opponent",
              filter: {
                kind: "all",
                filters: [
                  {
                    kind: "element",
                    oneOf: ["WIND"],
                  },
                  {
                    kind: "type",
                    oneOf: ["CHAMPION"],
                  },
                ],
              },
            },
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default windResonanceBauble;
