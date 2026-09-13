import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const silvershine: GrandArchiveCard<GrandArchiveAbilityDefinition, "token-representation"> =
  {
    canonicalId: "bd7ozuj68m",
    slug: "silvershine",
    definitionKind: "token-representation",
    layout: {
      kind: "single-faced",
      face: {
        id: "bd7ozuj68m:face:default",
        catalogId: "bd7ozuj68m",
        name: "Silvershine",
        cost: {
          kind: "reserve",
          amount: 1,
        },
        typeLine: {
          supertypes: [],
          types: ["ITEM"],
          classes: ["CLERIC"],
          subtypes: ["CLERIC", "HERB", "CATALYST", "FLOWER"],
        },
        elements: ["NORM"],
        stats: {},
        rulesText: "Sacrifice Silvershine: Recover 1.",
        abilities: [
          {
            id: "bd7ozuj68m-a1",
            kind: "activated",
            text: "Sacrifice Silvershine: Recover 1.",
            activation: "ability",
            cost: {
              kind: "sacrifice",
              subject: {
                kind: "source",
              },
            },
            effect: {
              kind: "recover",
              player: "controller",
              amount: 1,
            },
          },
        ],
      },
    },
  };

export default silvershine;
