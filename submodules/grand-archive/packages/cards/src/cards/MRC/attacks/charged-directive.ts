import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const chargedDirective: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "L2smMJ3Ucb",
  slug: "charged-directive",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "L2smMJ3Ucb:face:default",
      catalogId: "L2smMJ3Ucb",
      name: "Charged Directive",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "AUTOMATON", "COMMAND"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
      },
      rulesText:
        "Command Automaton (An Automaton ally you control performs this attack.)\n\nOn Attack: Summon a Powercell token rested. Then each opponent banishes X cards from their graveyard, where X is the amount of Powercells you control.",
      abilities: [
        {
          id: "L2smMJ3Ucb-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Command Automaton (An Automaton ally you control performs this attack.)",
          keyword: {
            name: "command",
            subtype: "Automaton",
          },
        },
        {
          id: "L2smMJ3Ucb-a2",
          kind: "triggered",
          text: "On Attack: Summon a Powercell token rested. Then each opponent banishes X cards from their graveyard, where X is the amount of Powercells you control.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
          },
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "count",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "name",
                    value: "Powercell",
                  },
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "summon",
                object: "Powercell",
                controller: "controller",
                entersWithStates: ["rested"],
              },
              {
                kind: "for-each-player",
                players: "each-opponent",
                bindEachAs: "opponent",
                effect: {
                  kind: "banish",
                  player: {
                    binding: "opponent",
                  },
                  selection: {
                    id: "banished-cards",
                    kind: "choice",
                    declared: "resolution",
                    chooser: {
                      binding: "opponent",
                    },
                    count: {
                      kind: "exactly",
                      amount: {
                        kind: "count",
                        collection: {
                          zones: ["field"],
                          player: "controller",
                          filter: {
                            kind: "name",
                            value: "Powercell",
                          },
                        },
                      },
                    },
                    candidates: {
                      kind: "card",
                      zones: ["graveyard"],
                      relationship: "zone-of",
                      player: {
                        binding: "opponent",
                      },
                    },
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default chargedDirective;
