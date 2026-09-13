import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const forceLoad: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "y6isxy5lh2",
  slug: "force-load",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "y6isxy5lh2:face:default",
      catalogId: "y6isxy5lh2",
      name: "Force Load",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL"],
      },
      elements: ["FIRE"],
      speed: "slow",
      stats: {},
      rulesText:
        "Choose a fire or norm element Bullet card from your material deck with memory cost 0 and load it into target Gun weapon you control. (As a weapon is used for an attack, all of its loaded cards are put into the attacker's intent.)",
      abilities: [
        {
          id: "y6isxy5lh2-a1",
          kind: "card-resolution",
          text: "Choose a fire or norm element Bullet card from your material deck with memory cost 0 and load it into target Gun weapon you control. (As a weapon is used for an attack, all of its loaded cards are put into the attacker's intent.)",
          targets: [
            {
              id: "target-gun",
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
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["WEAPON"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["GUN"],
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "choose",
            selection: {
              id: "bullet-card",
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
                zones: ["material-deck"],
                relationship: "zone-of",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "subtype",
                      oneOf: ["BULLET"],
                    },
                    {
                      kind: "element",
                      oneOf: ["FIRE", "NORM"],
                    },
                    {
                      kind: "numeric",
                      comparison: {
                        left: {
                          kind: "property",
                          subject: {
                            kind: "candidate",
                          },
                          property: "memory-cost",
                          basis: "base",
                        },
                        operator: "eq",
                        right: 0,
                      },
                    },
                  ],
                },
              },
            },
            effect: {
              kind: "move",
              subject: {
                kind: "bound",
                binding: "bullet-card",
              },
              from: "material-deck",
              destination: {
                zone: "loaded",
                host: {
                  kind: "bound",
                  binding: "target-gun",
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default forceLoad;
