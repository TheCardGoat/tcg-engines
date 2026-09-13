import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const orbOfHubris: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "af098kmoi0",
  slug: "orb-of-hubris",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "af098kmoi0:face:default",
      catalogId: "af098kmoi0",
      name: "Orb of Hubris",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "BAUBLE"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Banish Orb of Hubris: Draw up to three cards, then shuffle that amount of cards from your hand into your deck.",
      abilities: [
        {
          id: "af098kmoi0-a1",
          kind: "activated",
          text: "Banish Orb of Hubris: Draw up to three cards, then shuffle that amount of cards from your hand into your deck.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "choose-value",
                selection: {
                  id: "draw-count",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  unique: true,
                  candidates: {
                    kind: "number",
                    minimum: 0,
                    maximum: 3,
                  },
                },
                trackAs: "draw-count",
              },
              {
                kind: "draw",
                player: "controller",
                amount: {
                  kind: "binding",
                  binding: "draw-count",
                },
              },
              {
                kind: "choose",
                selection: {
                  id: "returned-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: {
                      kind: "binding",
                      binding: "draw-count",
                    },
                  },
                  candidates: {
                    kind: "card",
                    zones: ["hand"],
                    relationship: "zone-of",
                    player: "controller",
                  },
                },
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "move",
                      subject: {
                        kind: "bound",
                        binding: "returned-cards",
                      },
                      from: "hand",
                      destination: {
                        zone: "main-deck",
                        placement: {
                          kind: "unordered",
                        },
                      },
                    },
                    {
                      kind: "shuffle",
                      player: "controller",
                      zone: "main-deck",
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

export default orbOfHubris;
