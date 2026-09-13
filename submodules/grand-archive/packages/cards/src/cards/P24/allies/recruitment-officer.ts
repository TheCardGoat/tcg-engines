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
                kind: "optional",
                player: "controller",
                allOrNothing: true,
                effect: {
                  kind: "reveal",
                  player: "controller",
                  selection: {
                    id: "reveal-selection",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    candidates: {
                      kind: "card",
                      zones: ["hand"],
                      relationship: "zone-of",
                      player: "controller",
                      filter: {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                    },
                  },
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
                  zone: "main-deck",
                  placement: {
                    kind: "bottom",
                    orderChosenBy: "controller",
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
