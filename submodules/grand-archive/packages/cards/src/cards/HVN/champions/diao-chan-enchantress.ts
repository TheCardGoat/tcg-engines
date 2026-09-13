import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const diaoChanEnchantress: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "00xbh8oc00",
  slug: "diao-chan-enchantress",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "00xbh8oc00:face:default",
      catalogId: "00xbh8oc00",
      name: "Diao Chan, Enchantress",
      lineageName: "Diao Chan",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 1,
        life: 19,
      },
      rulesText:
        "On Enter: Put two glimmer counters on Diao Chan.\n\nInherited Effect — REST: Activate a Reaction Spell card from your memory. Pay its reserve cost only by removing that many glimmer counters from Diao Chan. Activate this ability only during an opponent's turn.",
      abilities: [
        {
          id: "00xbh8oc00-a1",
          kind: "triggered",
          text: "On Enter: Put two glimmer counters on Diao Chan.",
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
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: {
              named: "glimmer",
            },
            amount: 2,
          },
        },
        {
          id: "00xbh8oc00-a2",
          kind: "activated",
          activation: "ability",
          text: "Inherited Effect — REST: Activate a Reaction Spell card from your memory. Pay its reserve cost only by removing that many glimmer counters from Diao Chan. Activate this ability only during an opponent's turn.",
          executionSource: "lineage-host",
          cost: {
            kind: "rest",
            subject: {
              kind: "ability-bearer",
            },
          },
          condition: {
            kind: "turn-player",
            player: "opponent",
          },
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "property",
                subject: {
                  kind: "bound",
                  binding: "reaction-spell",
                },
                property: "reserve-cost",
                basis: "base",
              },
            },
          ],
          effect: {
            kind: "choose",
            selection: {
              id: "reaction-spell",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              candidates: {
                kind: "card",
                zones: ["memory"],
                relationship: "zone-of",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "subtype",
                      oneOf: ["REACTION"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["SPELL"],
                    },
                  ],
                },
              },
            },
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "pay-cost",
                  player: "controller",
                  cost: {
                    kind: "remove-counter",
                    subject: {
                      kind: "ability-bearer",
                    },
                    counter: {
                      named: "glimmer",
                    },
                    amount: {
                      kind: "property",
                      subject: {
                        kind: "bound",
                        binding: "reaction-spell",
                      },
                      property: "reserve-cost",
                      basis: "base",
                    },
                  },
                },
                {
                  kind: "activate-card",
                  subject: {
                    kind: "bound",
                    binding: "reaction-spell",
                  },
                  payCosts: false,
                  speed: "fast",
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default diaoChanEnchantress;
