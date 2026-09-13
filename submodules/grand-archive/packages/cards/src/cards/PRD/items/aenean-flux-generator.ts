import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const aeneanFluxGenerator: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "oCqKBEPemA",
  slug: "aenean-flux-generator",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "oCqKBEPemA:face:default",
      catalogId: "oCqKBEPemA",
      name: "Aenean Flux Generator",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "VELTECH", "DEVICE"],
      },
      elements: ["WIND"],
      stats: {},
      rulesText:
        "On Enter: Draw a card into your memory.\n\n[Class Bonus] Whenever you activate an empowered Aenean Spell card, you may rest Aenean Flux Generator. When you do, as a Spell, deal 2 damage to target champion.\n\n",
      abilities: [
        {
          id: "oCqKBEPemA-a1",
          kind: "triggered",
          text: "On Enter: Draw a card into your memory.",
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
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
        {
          id: "oCqKBEPemA-a2",
          kind: "triggered",
          text: "[Class Bonus] Whenever you activate an empowered Aenean Spell card, you may rest Aenean Flux Generator. When you do, as a Spell, deal 2 damage to target champion.",
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "controller",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "activation-state",
                      state: "empowered",
                    },
                    {
                      kind: "subtype",
                      oneOf: ["SPELL"],
                    },
                  ],
                },
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
              kind: "reflexive",
              action: {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              consequence: {
                kind: "perform-as",
                sourceKind: "spell",
                effect: {
                  kind: "deal-damage",
                  source: {
                    kind: "source",
                  },
                  recipient: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  amount: 2,
                },
              },
              targets: [
                {
                  id: "target-1",
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
                    filter: {
                      kind: "type",
                      oneOf: ["CHAMPION"],
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

export default aeneanFluxGenerator;
