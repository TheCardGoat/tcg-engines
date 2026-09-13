import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const diviningStreams: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "TLqUZgBeg7",
  slug: "divining-streams",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "TLqUZgBeg7:face:default",
      catalogId: "TLqUZgBeg7",
      name: "Divining Streams",
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
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "Look at the top three cards of your deck. Put one of them into your graveyard, one on top of your deck, and one on the bottom of your deck.\n\n[Class Bonus] Floating Memory",
      abilities: [
        {
          id: "TLqUZgBeg7-a1",
          kind: "card-resolution",
          text: "Look at the top three cards of your deck. Put one of them into your graveyard, one on top of your deck, and one on the bottom of your deck.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "look-at",
                player: "controller",
                selection: {
                  id: "looked-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 3,
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
                  id: "graveyard-card",
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
                    binding: "looked-cards",
                  },
                },
                effect: {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "graveyard-card",
                  },
                  from: "main-deck",
                  destination: {
                    zone: "graveyard",
                  },
                },
              },
              {
                kind: "choose",
                selection: {
                  id: "top-card",
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
                    binding: "looked-cards",
                    excluding: ["graveyard-card"],
                  },
                },
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "move",
                      subject: {
                        kind: "bound",
                        binding: "top-card",
                      },
                      from: "main-deck",
                      destination: {
                        zone: "main-deck",
                        placement: {
                          kind: "top",
                        },
                      },
                    },
                    {
                      kind: "move",
                      subject: {
                        kind: "binding-remainder",
                        binding: "looked-cards",
                        excluding: ["graveyard-card", "top-card"],
                      },
                      from: "main-deck",
                      destination: {
                        zone: "main-deck",
                        placement: {
                          kind: "bottom",
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          id: "TLqUZgBeg7-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory",
          keyword: {
            name: "floating-memory",
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
        },
      ],
    },
  },
};

export default diviningStreams;
