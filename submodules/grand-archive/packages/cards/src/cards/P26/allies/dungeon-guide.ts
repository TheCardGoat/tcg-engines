import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const dungeonGuide: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "em6eEh9q8y",
  slug: "dungeon-guide",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "em6eEh9q8y:face:default",
      catalogId: "em6eEh9q8y",
      name: "Dungeon Guide",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "On Enter: You may banish two cards at random from your memory. If you do, level up your champion. (Your champion levels up into a compatible champion card from your material deck, ignoring materialization costs.)",
      abilities: [
        {
          id: "em6eEh9q8y-a1",
          kind: "triggered",
          text: "On Enter: You may banish two cards at random from your memory. If you do, level up your champion. (Your champion levels up into a compatible champion card from your material deck, ignoring materialization costs.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
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
                        amount: 2,
                      },
                      candidates: {
                        kind: "card",
                        zones: ["memory"],
                        relationship: "zone-of",
                        player: "controller",
                      },
                      method: "random",
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
                    kind: "level-up",
                    subject: {
                      kind: "champion",
                      player: "controller",
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

export default dungeonGuide;
