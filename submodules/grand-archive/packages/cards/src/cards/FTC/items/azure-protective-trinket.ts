import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const azureProtectiveTrinket: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "m3pal7cpvn",
  slug: "azure-protective-trinket",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "m3pal7cpvn:face:default",
      catalogId: "m3pal7cpvn",
      name: "Azure Protective Trinket",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Banish Azure Protective Trinket: Banish up to three target fire element cards from a single graveyard.",
      abilities: [
        {
          id: "m3pal7cpvn-a1",
          kind: "activated",
          text: "Banish Azure Protective Trinket: Banish up to three target fire element cards from a single graveyard.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          effect: {
            kind: "banish",
            player: "controller",
            selection: {
              id: "banished-cards",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 3,
              },
              candidates: {
                kind: "card",
                zones: ["hand"],
                relationship: "zone-of",
                player: "controller",
                filter: {
                  kind: "element",
                  oneOf: ["FIRE"],
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default azureProtectiveTrinket;
