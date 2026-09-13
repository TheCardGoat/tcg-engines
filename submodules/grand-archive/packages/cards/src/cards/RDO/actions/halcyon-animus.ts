import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const halcyonAnimus: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "uvopjFSUj0",
  slug: "halcyon-animus",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "uvopjFSUj0:face:default",
      catalogId: "uvopjFSUj0",
      name: "Halcyon Animus",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["CRUX"],
      speed: "slow",
      stats: {},
      rulesText:
        "Materialize a regalia card from your material deck or banishment. (You still pay for its costs.)",
      abilities: [
        {
          id: "uvopjFSUj0-a1",
          kind: "card-resolution",
          text: "Materialize a regalia card from your material deck or banishment. (You still pay for its costs.)",
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
              unique: true,
              candidates: {
                kind: "card",
                zones: ["material-deck", "banishment"],
                relationship: "zone-of",
                player: "controller",
                filter: {
                  kind: "supertype",
                  oneOf: ["REGALIA"],
                },
              },
            },
            effect: {
              kind: "materialize-card",
              subject: {
                kind: "bound",
                binding: "materialized-card",
              },
              payCosts: true,
            },
          },
        },
      ],
    },
  },
};

export default halcyonAnimus;
