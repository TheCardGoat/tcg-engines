import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fractalOfWaves: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qVtWCAx3zb",
  slug: "fractal-of-waves",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qVtWCAx3zb:face:default",
      catalogId: "qVtWCAx3zb",
      name: "Fractal of Waves",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "FRACTAL"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "Whenever your champion levels up into a champion with base level 3, you may sacrifice Fractal of Waves. If you do, draw two cards into your memory.\n\nReservable (While paying for a reserve cost, you may rest this object to pay for 1 of that cost.)",
      abilities: [
        {
          id: "qVtWCAx3zb-a1",
          kind: "triggered",
          text: "Whenever your champion levels up into a champion with base level 3, you may sacrifice Fractal of Waves. If you do, draw two cards into your memory.",
          trigger: {
            kind: "event",
            event: {
              name: "champion-leveled-up",
              actor: "controller",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["CHAMPION"],
                    },
                    {
                      kind: "numeric",
                      comparison: {
                        left: {
                          kind: "property",
                          subject: {
                            kind: "candidate",
                          },
                          property: "level",
                          basis: "base",
                        },
                        operator: "eq",
                        right: 3,
                      },
                    },
                  ],
                },
              },
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "sacrifice",
                  subject: {
                    kind: "source",
                  },
                },
                {
                  kind: "draw",
                  player: "controller",
                  amount: 2,
                  to: "memory",
                },
              ],
            },
          },
        },
        {
          id: "qVtWCAx3zb-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Reservable (While paying for a reserve cost, you may rest this object to pay for 1 of that cost.)",
          keyword: {
            name: "reservable",
          },
        },
      ],
    },
  },
};

export default fractalOfWaves;
