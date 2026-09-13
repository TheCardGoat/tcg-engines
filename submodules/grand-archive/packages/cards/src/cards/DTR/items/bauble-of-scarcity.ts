import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const baubleOfScarcity: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "24ansclpqc",
  slug: "bauble-of-scarcity",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "24ansclpqc:face:default",
      catalogId: "24ansclpqc",
      name: "Bauble of Scarcity",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "DISTORTION", "BAUBLE"],
      },
      elements: ["UMBRA"],
      stats: {},
      rulesText: "Banish Bauble of Scarcity: Each player discards a card.",
      abilities: [
        {
          id: "24ansclpqc-a1",
          kind: "activated",
          text: "Banish Bauble of Scarcity: Each player discards a card.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          effect: {
            kind: "discard",
            player: "each-player",
            selection: {
              id: "discarded-cards",
              kind: "choice",
              declared: "resolution",
              chooser: "each-player",
              count: {
                kind: "exactly",
                amount: 1,
              },
              candidates: {
                kind: "card",
                zones: ["hand"],
                relationship: "zone-of",
                player: "each-player",
              },
            },
          },
        },
      ],
    },
  },
};

export default baubleOfScarcity;
