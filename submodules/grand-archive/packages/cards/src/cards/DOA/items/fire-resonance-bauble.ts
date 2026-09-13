import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fireResonanceBauble: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "LROrzTmh55",
  slug: "fire-resonance-bauble",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "LROrzTmh55:face:default",
      catalogId: "LROrzTmh55",
      name: "Fire Resonance Bauble",
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
        "Banish Fire Resonance Bauble: Draw a card. Activate this ability only if an opponent controls a fire element champion.",
      abilities: [
        {
          id: "LROrzTmh55-a1",
          kind: "activated",
          text: "Banish Fire Resonance Bauble: Draw a card. Activate this ability only if an opponent controls a fire element champion.",
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
                    oneOf: ["FIRE"],
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

export default fireResonanceBauble;
