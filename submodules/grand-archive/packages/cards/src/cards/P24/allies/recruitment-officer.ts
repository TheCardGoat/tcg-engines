import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const recruitmentOfficer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "1x97n2jnlt",
  slug: "recruitment-officer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "1x97n2jnlt:face:default",
      catalogId: "1x97n2jnlt",
      name: "Recruitment Officer",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "[Class Bonus] Foster \n\nOn Foster: Look at the top five cards of your deck. You may reveal an ally card from among them and put it into your hand. Put the rest of the cards on the bottom of your deck in any order.",
      abilities: [
        {
          id: "1x97n2jnlt-a1",
          kind: "triggered",
          intrinsic: true,
          text: "[Class Bonus] Foster",
          keyword: {
            name: "foster",
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
        {
          id: "1x97n2jnlt-a2",
          kind: "triggered",
          text: "On Foster: Look at the top five cards of your deck. You may reveal an ally card from among them and put it into your hand. Put the rest of the cards on the bottom of your deck in any order.",
          trigger: {
            kind: "event",
            event: {
              name: "object-fostered",
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
                    amount: 5,
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
                  id: "chosen-card",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "up-to",
                    amount: 1,
                  },
                  unique: true,
                  candidates: {
                    kind: "card",
                    binding: "referenced-cards",
                    filter: {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                  },
                },
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "reveal",
                      player: "controller",
                      selection: {
                        id: "revealed-card",
                        kind: "choice",
                        declared: "resolution",
                        chooser: "controller",
                        count: {
                          kind: "all",
                        },
                        unique: true,
                        candidates: {
                          kind: "card",
                          binding: "chosen-card",
                        },
                      },
                    },
                    {
                      kind: "move",
                      subject: {
                        kind: "bound",
                        binding: "chosen-card",
                      },
                      destination: {
                        zone: "hand",
                      },
                    },
                  ],
                },
              },
              {
                kind: "choose",
                selection: {
                  id: "ordered-remainder",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "all",
                  },
                  ordered: true,
                  unique: true,
                  candidates: {
                    kind: "card",
                    binding: "referenced-cards",
                    excluding: ["chosen-card"],
                  },
                },
                effect: {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "ordered-remainder",
                  },
                  destination: {
                    zone: "main-deck",
                    placement: {
                      kind: "bottom",
                    },
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default recruitmentOfficer;
