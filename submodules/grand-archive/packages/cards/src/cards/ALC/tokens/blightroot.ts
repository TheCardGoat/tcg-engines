import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const blightroot: GrandArchiveCard<GrandArchiveAbilityDefinition, "token-representation"> = {
  canonicalId: "i0a5uhjxhk",
  slug: "blightroot",
  definitionKind: "token-representation",
  layout: {
    kind: "single-faced",
    face: {
      id: "i0a5uhjxhk:face:default",
      catalogId: "i0a5uhjxhk",
      name: "Blightroot",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HERB", "CATALYST", "ROOT"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText: "Sacrifice Blightroot: Your champion gets +1 level until end of turn.",
      abilities: [
        {
          id: "i0a5uhjxhk-a1",
          kind: "activated",
          text: "Sacrifice Blightroot: Your champion gets +1 level until end of turn.",
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

export default blightroot;
