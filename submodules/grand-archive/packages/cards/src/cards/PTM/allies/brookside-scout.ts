import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const brooksideScout: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "9asvHr4bsz",
  slug: "brookside-scout",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "9asvHr4bsz:face:default",
      catalogId: "9asvHr4bsz",
      name: "Brookside Scout",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "Deluge 3 — On Enter: If you have three or more water element cards in your graveyard, you may load an Aethercharge card from your graveyard into an Aetherwing weapon you control.\n\nFloating Memory",
      abilities: [
        {
          id: "9asvHr4bsz-a1",
          kind: "triggered",
          text: "Deluge 3 — On Enter: If you have three or more water element cards in your graveyard, you may load an Aethercharge card from your graveyard into an Aetherwing weapon you control.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          interveningCondition: {
            kind: "compare",
            comparison: {
              left: {
                kind: "count",
                collection: {
                  zones: ["graveyard"],
                  player: "controller",
                  filter: {
                    kind: "element",
                    oneOf: ["WATER"],
                  },
                },
              },
              operator: "gte",
              right: 3,
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "choose",
              selection: {
                id: "aethercharge-card",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
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
                    binding: "aethercharge-card",
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
          },
        },
        {
          id: "9asvHr4bsz-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
  },
};

export default brooksideScout;
