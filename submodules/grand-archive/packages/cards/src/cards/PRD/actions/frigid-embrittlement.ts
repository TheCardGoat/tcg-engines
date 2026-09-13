import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const frigidEmbrittlement: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "TTKicbMVMU",
  slug: "frigid-embrittlement",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "TTKicbMVMU:face:default",
      catalogId: "TTKicbMVMU",
      name: "Frigid Embrittlement",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL", "REACTION"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "Deal 2 damage to target rested unit. If that unit is an Automaton, deal 4 damage to it instead.",
      abilities: [
        {
          id: "TTKicbMVMU-a1",
          kind: "card-resolution",
          text: "Deal 2 damage to target rested unit. If that unit is an Automaton, deal 4 damage to it instead.",
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
                      oneOf: ["ALLY", "CHAMPION"],
                    },
                    {
                      kind: "object-state",
                      state: "rested",
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "conditional",
            condition: {
              kind: "subject-matches",
              subject: {
                kind: "bound",
                binding: "target-1",
              },
              filter: {
                kind: "subtype",
                oneOf: ["AUTOMATON"],
              },
            },
            then: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "bound",
                binding: "target-1",
              },
              amount: 4,
            },
            else: {
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
        },
      ],
    },
  },
};

export default frigidEmbrittlement;
