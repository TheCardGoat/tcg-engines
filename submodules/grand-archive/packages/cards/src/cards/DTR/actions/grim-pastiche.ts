import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const grimPastiche: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "akmv2ssjhu",
  slug: "grim-pastiche",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "akmv2ssjhu:face:default",
      catalogId: "akmv2ssjhu",
      name: "Grim Pastiche",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SKILL"],
      },
      elements: ["UMBRA"],
      speed: "fast",
      stats: {},
      rulesText:
        "Copy target non-Skill action omen you have with reserve cost 5 or less. If you do, you may activate that copy without paying its reserve cost. (If you don't activate it, the copy ceases to exist.)",
      abilities: [
        {
          id: "akmv2ssjhu-a1",
          kind: "card-resolution",
          text: "Copy target non-Skill action omen you have with reserve cost 5 or less. If you do, you may activate that copy without paying its reserve cost. (If you don't activate it, the copy ceases to exist.)",
          targets: [
            {
              id: "target-omen",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "card",
                zones: ["banishment"],
                relationship: "zone-of",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ACTION"],
                    },
                    {
                      kind: "has-counter",
                      counter: "omen",
                    },
                    {
                      kind: "not",
                      filter: {
                        kind: "subtype",
                        oneOf: ["SKILL"],
                      },
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
                        right: 5,
                      },
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
                kind: "copy",
                subject: {
                  kind: "bound",
                  binding: "target-omen",
                },
                copy: "object",
                bindResultAs: "omen-copy",
              },
              {
                kind: "optional",
                player: "controller",
                allOrNothing: true,
                effect: {
                  kind: "activate-card",
                  subject: {
                    kind: "bound",
                    binding: "omen-copy",
                  },
                  payCosts: false,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default grimPastiche;
