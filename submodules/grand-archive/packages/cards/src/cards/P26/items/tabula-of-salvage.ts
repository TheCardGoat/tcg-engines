import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tabulaOfSalvage: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "9cy4wipw4k",
  slug: "tabula-of-salvage",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "9cy4wipw4k:face:default",
      catalogId: "9cy4wipw4k",
      name: "Tabula of Salvage",
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
        "Banish Tabula of Salvage: Choose up to five cards from your graveyard and put them on the bottom of your deck in any order.",
      abilities: [
        {
          id: "9cy4wipw4k-a1",
          kind: "activated",
          text: "Banish Tabula of Salvage: Choose up to five cards from your graveyard and put them on the bottom of your deck in any order.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          effect: {
            kind: "choose",
            selection: {
              id: "returned-cards",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 5,
              },
              candidates: {
                kind: "card",
                zones: ["graveyard"],
                relationship: "zone-of",
                player: "controller",
              },
            },
            effect: {
              kind: "move",
              subject: {
                kind: "bound",
                binding: "returned-cards",
              },
              from: "graveyard",
              destination: {
                zone: "main-deck",
                placement: {
                  kind: "bottom",
                  orderChosenBy: "controller",
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default tabulaOfSalvage;
