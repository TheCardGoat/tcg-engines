import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const berthaSpryHowitzer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ki6fxxgmue",
  slug: "bertha-spry-howitzer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ki6fxxgmue:face:default",
      catalogId: "ki6fxxgmue",
      name: "Bertha, Spry Howitzer",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Fast Activation, Ranged 2\n\n[Class Bonus] [Level 2+] On Enter: Look at the top five cards of your deck. You may activate a Ranger action card with reserve cost 2 or less from among them without paying its costs. Put the rest on the bottom of your deck in any order.",
      abilities: [
        {
          id: "ki6fxxgmue-a1",
          kind: "keyword-group",
          text: "Fast Activation, Ranged 2",
          keywords: [
            {
              name: "fast-activation",
            },
            {
              name: "ranged",
              value: 2,
            },
          ],
        },
        {
          id: "ki6fxxgmue-a2",
          kind: "triggered",
          text: "[Class Bonus] [Level 2+] On Enter: Look at the top five cards of your deck. You may activate a Ranger action card with reserve cost 2 or less from among them without paying its costs. Put the rest on the bottom of your deck in any order.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
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
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 2,
                },
              },
            },
          ],
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
                  id: "activated-ranger-action",
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
                    binding: "looked-cards",
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "type",
                          oneOf: ["ACTION"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["RANGER"],
                        },
                        {
                          kind: "numeric",
                          comparison: {
                            left: {
                              kind: "property",
                              subject: {
                                kind: "candidate",
                              },
                              property: "reserve-cost",
                              basis: "base",
                            },
                            operator: "lte",
                            right: 2,
                          },
                        },
                      ],
                    },
                  },
                },
                effect: {
                  kind: "activate-card",
                  subject: {
                    kind: "bound",
                    binding: "activated-ranger-action",
                  },
                  payCosts: false,
                },
              },
              {
                kind: "move",
                subject: {
                  kind: "binding-remainder",
                  binding: "looked-cards",
                  excluding: "activated-ranger-action",
                },
                from: "main-deck",
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

export default berthaSpryHowitzer;
