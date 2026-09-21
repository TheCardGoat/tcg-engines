import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const seekersRifle: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "3gygojwk0p",
  slug: "seekers-rifle",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "3gygojwk0p:face:default",
      catalogId: "3gygojwk0p",
      name: "Seeker's Rifle",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "GUN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        durability: 2,
      },
      rulesText:
        "[Class Bonus] True Sight (Attacks using this weapon can target units with stealth.) \n\n[Class Bonus] Spellshroud\n\nOn Kill: You may pay (2). If you do, materialize a Bullet card from your material deck.",
      abilities: [
        {
          id: "3gygojwk0p-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] True Sight (Attacks using this weapon can target units with stealth.)",
          keyword: {
            name: "true-sight",
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
          id: "3gygojwk0p-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Spellshroud",
          keyword: {
            name: "spellshroud",
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
          id: "3gygojwk0p-a3",
          kind: "triggered",
          text: "On Kill: You may pay (2). If you do, materialize a Bullet card from your material deck.",
          trigger: {
            kind: "event",
            event: {
              name: "object-killed",
              subject: {
                kind: "source",
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
                  kind: "attempt",
                  effect: {
                    kind: "pay",
                    player: "controller",
                    cost: {
                      kind: "pay-reserve",
                      amount: 2,
                    },
                  },
                  bindSucceededAs: "optional-action-succeeded",
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "effect-succeeded",
                    binding: "optional-action-succeeded",
                  },
                  then: {
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
                          kind: "subtype",
                          oneOf: ["BULLET"],
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
        },
      ],
    },
  },
};

export default seekersRifle;
