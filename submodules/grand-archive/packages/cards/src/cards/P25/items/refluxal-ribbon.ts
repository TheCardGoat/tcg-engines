import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const refluxalRibbon: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vm4xg2hedp",
  slug: "refluxal-ribbon",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vm4xg2hedp:face:default",
      catalogId: "vm4xg2hedp",
      name: "Refluxal Ribbon",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "(2), Banish Refluxal Ribbon: Load target Aethercharge card from your graveyard into an Aetherwing weapon you control.",
      abilities: [
        {
          id: "vm4xg2hedp-a1",
          kind: "activated",
          text: "(2), Banish Refluxal Ribbon: Load target Aethercharge card from your graveyard into an Aetherwing weapon you control.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
              },
              {
                kind: "banish-self",
              },
            ],
          },
          targets: [
            {
              id: "target-aethercharge",
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
                zones: ["graveyard"],
                relationship: "zone-of",
                player: "controller",
                filter: {
                  kind: "subtype",
                  oneOf: ["AETHERCHARGE"],
                },
              },
            },
          ],
          effect: {
            kind: "choose",
            selection: {
              id: "aetherwing-weapon",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["WEAPON"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["AETHERWING"],
                    },
                  ],
                },
              },
            },
            effect: {
              kind: "move",
              subject: {
                kind: "bound",
                binding: "target-aethercharge",
              },
              from: "graveyard",
              destination: {
                zone: "loaded",
                host: {
                  kind: "bound",
                  binding: "aetherwing-weapon",
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default refluxalRibbon;
