import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const vorpalSword: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "PIcB5KuuMd",
  slug: "vorpal-sword",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "PIcB5KuuMd:face:default",
      catalogId: "PIcB5KuuMd",
      name: "Vorpal Sword",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SWORD"],
      },
      elements: ["CRUX"],
      stats: {
        power: 3,
        durability: 3,
      },
      rulesText:
        "Specter allies can't retaliate.\n\n[Merlin Bonus] REST, Banish a card from your material deck: Vorpal Sword gains spellshroud until end of turn.\n\n[Merlin Bonus] On Ally Hit: You may remove a preparation counter from your champion. If you do, wake up the attacker. Trigger this ability only once per turn.",
      abilities: [
        {
          id: "PIcB5KuuMd-a1",
          kind: "static",
          staticKind: "effects",
          text: "Specter allies can't retaliate.",
          effects: [
            {
              kind: "rule-modification",
              mode: "forbid",
              action: "retaliate",
              subject: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["SPECTER"],
                      },
                    ],
                  },
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "PIcB5KuuMd-a2",
          kind: "activated",
          text: "[Merlin Bonus] REST, Banish a card from your material deck: Vorpal Sword gains spellshroud until end of turn.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "select-and-move",
                player: "controller",
                from: "material-deck",
                to: "banishment",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
              },
            ],
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Merlin",
              },
            },
          ],
          effect: {
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
                name: "spellshroud",
              },
            },
          },
        },
        {
          id: "PIcB5KuuMd-a3",
          kind: "triggered",
          text: "[Merlin Bonus] On Ally Hit: You may remove a preparation counter from your champion. If you do, wake up the attacker. Trigger this ability only once per turn.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
              recipient: {
                kind: "event-object",
                bindAs: "trigger-recipient",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          },
          limit: {
            count: 1,
            per: "turn",
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Merlin",
              },
            },
          ],
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
                    kind: "remove-counter",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    counter: "preparation",
                    amount: 1,
                    bindResultAs: "removed-counters",
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
                    kind: "wake",
                    subject: {
                      kind: "event-attacker",
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

export default vorpalSword;
