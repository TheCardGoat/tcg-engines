import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const firetongue: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "j4lx6xwr42",
  slug: "firetongue",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "j4lx6xwr42:face:default",
      catalogId: "j4lx6xwr42",
      name: "Firetongue",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        durability: 1,
      },
      rulesText:
        "[Class Bonus] On Attack: You may banish a fire element card from your graveyard. If you do, put a durability counter on Firetongue.",
      abilities: [
        {
          id: "j4lx6xwr42-a1",
          kind: "triggered",
          text: "[Class Bonus] On Attack: You may banish a fire element card from your graveyard. If you do, put a durability counter on Firetongue.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
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
                        zones: ["graveyard"],
                        relationship: "zone-of",
                        player: "controller",
                        filter: {
                          kind: "element",
                          oneOf: ["FIRE"],
                        },
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
                    kind: "add-counter",
                    subject: {
                      kind: "source",
                    },
                    counter: "durability",
                    amount: 1,
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

export default firetongue;
