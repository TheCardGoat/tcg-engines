import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const waterResonanceBauble: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "dSSRtNnPtw",
  slug: "water-resonance-bauble",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "dSSRtNnPtw:face:default",
      catalogId: "dSSRtNnPtw",
      name: "Water Resonance Bauble",
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
        "Banish Water Resonance Bauble: Draw a card. Activate this ability only if an opponent controls a water element champion.",
      abilities: [
        {
          id: "dSSRtNnPtw-a1",
          kind: "activated",
          text: "Banish Water Resonance Bauble: Draw a card. Activate this ability only if an opponent controls a water element champion.",
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
                    oneOf: ["WATER"],
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

export default waterResonanceBauble;
