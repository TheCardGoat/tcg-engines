import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const spiritBladeGhostStrike: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vcZSHNHvKX",
  slug: "spirit-blade-ghost-strike",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vcZSHNHvKX:face:default",
      catalogId: "vcZSHNHvKX",
      name: "Spirit Blade: Ghost Strike",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["CRUX"],
      stats: {
        power: 1,
      },
      rulesText:
        "On Attack: You may banish a card from your material deck. If you do, your champion's attacks get +1 POWER until end of turn.",
      abilities: [
        {
          id: "vcZSHNHvKX-a1",
          kind: "triggered",
          text: "On Attack: You may banish a card from your material deck. If you do, your champion's attacks get +1 POWER until end of turn.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
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
                    kind: "banish",
                    player: "controller",
                    selection: {
                      id: "banished-cards",
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
                      },
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
                    kind: "continuous",
                    subjects: {
                      kind: "attacks-by",
                      attacker: {
                        kind: "champion",
                        player: "controller",
                      },
                    },
                    affectedSet: "dynamic",
                    duration: {
                      kind: "this-turn",
                    },
                    layer: {
                      layer: "E",
                      modifies: "stat",
                      sublayer: "modifier",
                    },
                    change: {
                      kind: "numeric",
                      property: "power",
                      operation: "add",
                      amount: 1,
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

export default spiritBladeGhostStrike;
