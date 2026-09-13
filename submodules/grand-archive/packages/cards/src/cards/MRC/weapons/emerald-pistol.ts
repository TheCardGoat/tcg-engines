import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const emeraldPistol: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "rptjej4mcn",
  slug: "emerald-pistol",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "rptjej4mcn:face:default",
      catalogId: "rptjej4mcn",
      name: "Emerald Pistol",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "GUN"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        durability: 2,
      },
      rulesText:
        "[Class Bonus] On Enter: Materialize a Bullet card with memory cost 0 from your material deck. (Apply this effect only if your champion’s class matches this card’s class.)",
      abilities: [
        {
          id: "rptjej4mcn-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Materialize a Bullet card with memory cost 0 from your material deck. (Apply this effect only if your champion’s class matches this card’s class.)",
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
          ],
          effect: {
            kind: "choose",
            selection: {
              id: "materialized-card",
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
                    {
                      kind: "subtype",
                      oneOf: ["BULLET"],
                    },
                  ],
                },
              },
            },
            effect: {
              kind: "materialize-card",
              subject: {
                kind: "bound",
                binding: "materialized-card",
              },
            },
          },
        },
      ],
    },
  },
};

export default emeraldPistol;
