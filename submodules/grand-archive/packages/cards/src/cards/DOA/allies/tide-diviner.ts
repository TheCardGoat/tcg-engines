import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tideDiviner: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "zrBBvgIvt6",
  slug: "tide-diviner",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "zrBBvgIvt6:face:default",
      catalogId: "zrBBvgIvt6",
      name: "Tide Diviner",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText:
        "On Enter: Look at the top 1+LV cards of your deck. Put one of those cards into your hand and the rest into your graveyard. (LV refers to your champion's level.)",
      abilities: [
        {
          id: "zrBBvgIvt6-a1",
          kind: "triggered",
          text: "On Enter: Look at the top 1+LV cards of your deck. Put one of those cards into your hand and the rest into your graveyard. (LV refers to your champion's level.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "look-at",
                player: "controller",
                selection: {
                  id: "referenced-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: {
                      kind: "calculate",
                      operator: "add",
                      operands: [
                        1,
                        {
                          kind: "property",
                          subject: {
                            kind: "champion",
                            player: "controller",
                          },
                          property: "level",
                          basis: "current",
                        },
                      ],
                    },
                  },
                  candidates: {
                    kind: "card",
                    zones: ["main-deck"],
                    relationship: "zone-of",
                    player: "controller",
                    fromTop: true,
                  },
                },
              },
              {
                kind: "choose",
                selection: {
                  id: "selected-referenced-card",
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
                    binding: "referenced-cards",
                  },
                },
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "move",
                      subject: {
                        kind: "bound",
                        binding: "selected-referenced-card",
                      },
                      destination: {
                        zone: "hand",
                      },
                    },
                    {
                      kind: "move",
                      subject: {
                        kind: "binding-remainder",
                        binding: "referenced-cards",
                        excluding: "selected-referenced-card",
                      },
                      destination: {
                        zone: "graveyard",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default tideDiviner;
