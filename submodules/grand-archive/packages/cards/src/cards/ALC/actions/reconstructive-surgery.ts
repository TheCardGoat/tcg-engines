import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const reconstructiveSurgery: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "z308kuz07n",
  slug: "reconstructive-surgery",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "z308kuz07n:face:default",
      catalogId: "z308kuz07n",
      name: "Reconstructive Surgery",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Choose one —\n• Put a buff counter on target Automaton ally.\n• [Level 2+] Return an Automaton ally card from your graveyard to your memory. (Choose this option only if your champion is level 2 or higher.)",
      abilities: [
        {
          id: "z308kuz07n-a1",
          kind: "card-resolution",
          text: "Choose one —\n• Put a buff counter on target Automaton ally.\n• [Level 2+] Return an Automaton ally card from your graveyard to your memory. (Choose this option only if your champion is level 2 or higher.)",
          effect: {
            kind: "select-modes",
            choose: {
              kind: "exactly",
              amount: 1,
            },
            modes: [
              {
                id: "mode-1",
                text: "Put a buff counter on target Automaton ally.",
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
                        kind: "all",
                        filters: [
                          {
                            kind: "type",
                            oneOf: ["ALLY"],
                          },
                          {
                            kind: "subtype",
                            oneOf: ["AUTOMATON"],
                          },
                        ],
                      },
                    },
                  },
                ],
                effect: {
                  kind: "add-counter",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  counter: "buff",
                  amount: 1,
                },
              },
              {
                id: "mode-2",
                text: "[Level 2+] Return an Automaton ally card from your graveyard to your memory",
                condition: {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "property",
                      subject: {
                        kind: "champion",
                        player: "controller",
                      },
                      property: "level",
                      basis: "current",
                    },
                    operator: "gte",
                    right: 2,
                  },
                },
                effect: {
                  kind: "choose",
                  selection: {
                    id: "chosen-automaton",
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
                        kind: "all",
                        filters: [
                          {
                            kind: "type",
                            oneOf: ["ALLY"],
                          },
                          {
                            kind: "subtype",
                            oneOf: ["AUTOMATON"],
                          },
                        ],
                      },
                    },
                  },
                  effect: {
                    kind: "move",
                    subject: {
                      kind: "bound",
                      binding: "chosen-automaton",
                    },
                    from: "graveyard",
                    destination: {
                      zone: "memory",
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

export default reconstructiveSurgery;
