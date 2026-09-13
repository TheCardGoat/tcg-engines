import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const clashOfFates: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "9rbziyasag",
  slug: "clash-of-fates",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "9rbziyasag:face:default",
      catalogId: "9rbziyasag",
      name: "Clash of Fates",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Guo Jia Bonus] You may remove a quest counter from your champion rather than pay this card's reserve cost.\n\nPut a buff counter on target Fatestone or Fatebound object. If that object is a Shenju ally, it gains vigor until end of turn. ",
      abilities: [
        {
          id: "9rbziyasag-a1",
          kind: "card-resolution",
          text: "[Guo Jia Bonus] You may remove a quest counter from your champion rather than pay this card's reserve cost.",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Guo Jia",
              },
            },
          ],
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "remove-counter",
              subject: {
                kind: "bound",
                binding: "target-1",
              },
              counter: {
                named: "quest",
              },
              amount: 1,
              bindResultAs: "removed-counters",
            },
          },
        },
        {
          id: "9rbziyasag-a2",
          kind: "card-resolution",
          text: "Put a buff counter on target Fatestone or Fatebound object. If that object is a Shenju ally, it gains vigor until end of turn.",
          targets: [
            {
              id: "9rbziyasag-a2:target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "any",
                  filters: [
                    {
                      kind: "subtype",
                      oneOf: ["FATESTONE"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["FATEBOUND"],
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "add-counter",
                subject: {
                  kind: "bound",
                  binding: "9rbziyasag-a2:target-1",
                },
                counter: "buff",
                amount: 1,
              },
              {
                kind: "conditional",
                condition: {
                  kind: "subject-matches",
                  subject: {
                    kind: "bound",
                    binding: "9rbziyasag-a2:target-1",
                  },
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["SHENJU"],
                      },
                    ],
                  },
                },
                then: {
                  kind: "continuous",
                  subjects: {
                    kind: "source",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "this-turn",
                  },
                  layer: {
                    layer: "D",
                    modifies: "ability",
                  },
                  change: {
                    kind: "grant-keyword",
                    keyword: {
                      name: "vigor",
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

export default clashOfFates;
