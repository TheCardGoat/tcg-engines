import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const manaroot: GrandArchiveCard<GrandArchiveAbilityDefinition, "token-representation"> = {
  canonicalId: "5joh300z2s",
  slug: "manaroot",
  definitionKind: "token-representation",
  layout: {
    kind: "single-faced",
    face: {
      id: "5joh300z2s:face:default",
      catalogId: "5joh300z2s",
      name: "Manaroot",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HERB", "ADJUVANT", "ROOT"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText: "Sacrifice Manaroot: Your champion gets +1 level until end of turn.",
      abilities: [
        {
          id: "5joh300z2s-a1",
          kind: "activated",
          text: "Sacrifice Manaroot: Your champion gets +1 level until end of turn.",
          activation: "ability",
          cost: {
            kind: "sacrifice",
            subject: {
              kind: "source",
            },
          },
          effect: {
            kind: "continuous",
            subjects: {
              kind: "champion",
              player: "controller",
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
            },
            layer: {
              layer: "E",
              modifies: "stat",
              sublayer: "modifier",
            },
            change: {
              kind: "numeric",
              property: "level",
              operation: "add",
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default manaroot;
