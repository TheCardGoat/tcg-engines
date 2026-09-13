import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lumberingSteed: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ic1ahsmwd0",
  slug: "lumbering-steed",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ic1ahsmwd0:face:default",
      catalogId: "ic1ahsmwd0",
      name: "Lumbering Steed",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "HORSE"],
      },
      elements: ["NORM"],
      stats: {
        power: 3,
        life: 3,
      },
      rulesText:
        "Hindered (This ally enters the field rested.) \n\n(2): Lumbering Steed gets +1 LIFE until end of turn.",
      abilities: [
        {
          id: "ic1ahsmwd0-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Hindered (This ally enters the field rested.)",
          keyword: {
            name: "hindered",
          },
        },
        {
          id: "ic1ahsmwd0-a2",
          kind: "activated",
          text: "(2): Lumbering Steed gets +1 LIFE until end of turn.",
          activation: "ability",
          cost: {
            kind: "pay-reserve",
            amount: 2,
          },
          effect: {
            kind: "continuous",
            subjects: {
              kind: "source",
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
              property: "life",
              operation: "add",
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default lumberingSteed;
