import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const beseechTheWinds: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "8qW1koLOK6",
  slug: "beseech-the-winds",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "8qW1koLOK6:face:default",
      catalogId: "8qW1koLOK6",
      name: "Beseech the Winds",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "SPELL"],
      },
      elements: ["WIND"],
      speed: "slow",
      stats: {},
      rulesText: "Materialize a card from your material deck. (You still pay for its costs.)",
      abilities: [
        {
          id: "8qW1koLOK6-a1",
          kind: "card-resolution",
          text: "Materialize a card from your material deck. (You still pay for its costs.)",
          effect: {
            kind: "choose",
            selection: {
              id: "materialized-card",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              candidates: {
                kind: "card",
                zones: ["material-deck"],
                relationship: "zone-of",
                player: "controller",
              },
            },
            effect: {
              kind: "materialize-card",
              subject: {
                kind: "bound",
                binding: "materialized-card",
              },
            },
          },
        },
      ],
    },
  },
};

export default beseechTheWinds;
