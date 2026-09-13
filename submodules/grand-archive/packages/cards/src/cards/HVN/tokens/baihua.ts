import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const baihua: GrandArchiveCard<GrandArchiveAbilityDefinition, "token-representation"> = {
  canonicalId: "i59eamoov0",
  slug: "baihua",
  definitionKind: "token-representation",
  layout: {
    kind: "single-faced",
    face: {
      id: "i59eamoov0:face:default",
      catalogId: "i59eamoov0",
      name: "Baihua",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "FLOWER"],
      },
      elements: ["TERA"],
      stats: {},
      rulesText: "At the beginning of your recollection phase, each opponent recovers 1.",
      abilities: [
        {
          id: "i59eamoov0-a1",
          kind: "triggered",
          text: "At the beginning of your recollection phase, each opponent recovers 1.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          effect: {
            kind: "recover",
            player: "each-opponent",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default baihua;
