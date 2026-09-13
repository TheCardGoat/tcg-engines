import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const dianaKeenHuntress: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "e3z4pyx8bd",
  slug: "diana-keen-huntress",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "e3z4pyx8bd:face:default",
      catalogId: "e3z4pyx8bd",
      name: "Diana, Keen Huntress",
      lineageName: "Diana",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 1,
        life: 19,
      },
      rulesText:
        "Lineage Release — Materialize a Gun card from your material deck. (Activate this ability by banishing this card from your champion's inner lineage.)",
      abilities: [
        {
          id: "e3z4pyx8bd-a1",
          kind: "activated",
          text: "Lineage Release — Materialize a Gun card from your material deck. (Activate this ability by banishing this card from your champion's inner lineage.)",
          keyword: {
            name: "lineage-release",
            cost: {
              kind: "banish-self",
            },
          },
          functionalZones: ["inner-lineage"],
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
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
                filter: {
                  kind: "subtype",
                  oneOf: ["GUN"],
                },
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

export default dianaKeenHuntress;
