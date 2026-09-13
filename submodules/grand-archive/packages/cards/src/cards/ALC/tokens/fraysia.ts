import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fraysia: GrandArchiveCard<GrandArchiveAbilityDefinition, "token-representation"> = {
  canonicalId: "soporhlq2k",
  slug: "fraysia",
  definitionKind: "token-representation",
  layout: {
    kind: "single-faced",
    face: {
      id: "soporhlq2k:face:default",
      catalogId: "soporhlq2k",
      name: "Fraysia",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HERB", "ADJUVANT", "FLOWER"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText: "Sacrifice Fraysia: Recover 1.",
      abilities: [
        {
          id: "soporhlq2k-a1",
          kind: "activated",
          text: "Sacrifice Fraysia: Recover 1.",
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

export default fraysia;
