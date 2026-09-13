import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const iridescentResurgence: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "fK1IQGsUeh",
  slug: "iridescent-resurgence",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "fK1IQGsUeh:face:default",
      catalogId: "fK1IQGsUeh",
      name: "Iridescent Resurgence",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["CRUX"],
      speed: "slow",
      stats: {},
      rulesText:
        "Return target non-champion non-regalia crux element card from your banishment or graveyard to your memory. ",
      abilities: [
        {
          id: "fK1IQGsUeh-a1",
          kind: "card-resolution",
          text: "Return target non-champion non-regalia crux element card from your banishment or graveyard to your memory.",
          targets: [
            {
              id: "target-card",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "card",
                zones: ["banishment", "graveyard"],
                relationship: "zone-of",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "element",
                      oneOf: ["CRUX"],
                    },
                    {
                      kind: "supertype",
                      oneOf: ["REGALIA"],
                    },
                    {
                      kind: "not",
                      filter: {
                        kind: "type",
                        oneOf: ["CHAMPION"],
                      },
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "move",
            subject: {
              kind: "bound",
              binding: "target-card",
            },
            destination: {
              zone: "memory",
            },
          },
        },
      ],
    },
  },
};

export default iridescentResurgence;
