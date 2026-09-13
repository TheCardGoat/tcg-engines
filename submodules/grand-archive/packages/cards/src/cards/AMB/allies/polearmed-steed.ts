import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const polearmedSteed: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7j79KANWEP",
  slug: "polearmed-steed",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7j79KANWEP:face:default",
      catalogId: "7j79KANWEP",
      name: "Pole-armed Steed",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER", "WARRIOR"],
        subtypes: ["TAMER", "WARRIOR", "ANIMAL", "HORSE"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "[Jin Bonus] On Enter: Materialize a Polearm regalia card from your material deck.",
      abilities: [
        {
          id: "7j79KANWEP-a1",
          kind: "triggered",
          text: "[Jin Bonus] On Enter: Materialize a Polearm regalia card from your material deck.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Jin",
              },
            },
          ],
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
                  kind: "all",
                  filters: [
                    {
                      kind: "supertype",
                      oneOf: ["REGALIA"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["POLEARM"],
                    },
                  ],
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

export default polearmedSteed;
