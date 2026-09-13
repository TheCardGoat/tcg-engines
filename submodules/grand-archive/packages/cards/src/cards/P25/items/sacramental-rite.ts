import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sacramentalRite: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "TL19V7lU6A",
  slug: "sacramental-rite",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "TL19V7lU6A:face:default",
      catalogId: "TL19V7lU6A",
      name: "Sacramental Rite",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ARTIFACT"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Divine Relic\n\nOn Enter: Banish a non-champion card from your material deck face down.\n\nBanish Sacramental Rite: Your champion becomes an Ascendant in addition to its other types. You may play the banished card. ",
      abilities: [
        {
          id: "TL19V7lU6A-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Divine Relic",
          keyword: {
            name: "divine-relic",
          },
        },
        {
          id: "TL19V7lU6A-a2",
          kind: "triggered",
          text: "On Enter: Banish a non-champion card from your material deck face down.",
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
            kind: "banish",
            player: "controller",
            selection: {
              id: "banished-cards",
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
                      kind: "type",
                      oneOf: ["CHAMPION"],
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
            faceDown: true,
          },
        },
        {
          id: "TL19V7lU6A-a3",
          kind: "activated",
          text: "Banish Sacramental Rite: Your champion becomes an Ascendant in addition to its other types. You may play the banished card.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "continuous",
                subjects: {
                  kind: "champion",
                  player: "controller",
                },
                affectedSet: "locked",
                duration: {
                  kind: "permanent",
                },
                layer: {
                  layer: "B",
                  modifies: "type",
                },
                change: {
                  kind: "add-characteristic",
                  characteristic: {
                    kind: "subtype",
                    value: "ASCENDANT",
                  },
                },
              },
              {
                kind: "optional",
                player: "controller",
                allOrNothing: true,
                effect: {
                  kind: "play-card",
                  subject: {
                    kind: "each",
                    collection: {
                      zones: ["banishment"],
                      host: {
                        kind: "source",
                      },
                      relationship: "banished-by",
                    },
                  },
                  payCosts: true,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default sacramentalRite;
