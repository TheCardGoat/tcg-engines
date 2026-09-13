import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const incineratorFelindroid: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Vl03t5rMSA",
  slug: "incinerator-felindroid",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Vl03t5rMSA:face:default",
      catalogId: "Vl03t5rMSA",
      name: "Incinerator Felindroid",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC", "TAMER"],
        subtypes: ["CLERIC", "TAMER", "DISCORP", "AUTOMATON", "CAT"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "[Class Bonus] On Enter: You may banish two fire element cards from your graveyard. When you do, as a Spell, deal 3 damage to target ally. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "Vl03t5rMSA-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: You may banish two fire element cards from your graveyard. When you do, as a Spell, deal 3 damage to target ally. (Apply this effect only if your champion's class matches this card's class.)",
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "reflexive",
              action: {
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
                  amount: 3,
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
                      oneOf: ["ALLY"],
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

export default incineratorFelindroid;
