import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const quicksilverGrail: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "cxyky280mt",
  slug: "quicksilver-grail",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "cxyky280mt:face:default",
      catalogId: "cxyky280mt",
      name: "Quicksilver Grail",
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
        "Divine Relic (You can only have one card with this keyword in your material deck.)\n\nOn Enter: Banish a non-champion card from your material deck face down.\n\nBanish Quicksilver Grail: You may play the banished card. (You still pay for its costs.)",
      abilities: [
        {
          id: "cxyky280mt-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Divine Relic (You can only have one card with this keyword in your material deck.)",
          keyword: {
            name: "divine-relic",
          },
        },
        {
          id: "cxyky280mt-a2",
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
          id: "cxyky280mt-a3",
          kind: "activated",
          text: "Banish Quicksilver Grail: You may play the banished card. (You still pay for its costs.)",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          effect: {
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
        },
      ],
    },
  },
};

export default quicksilverGrail;
