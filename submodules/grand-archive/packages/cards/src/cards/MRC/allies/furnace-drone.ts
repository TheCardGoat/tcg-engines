import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const furnaceDrone: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "cbNF64gCsS",
  slug: "furnace-drone",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "cbNF64gCsS:face:default",
      catalogId: "cbNF64gCsS",
      name: "Furnace Drone",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "AUTOMATON"],
      },
      elements: ["FIRE"],
      stats: {
        power: 3,
        life: 4,
      },
      rulesText:
        "As an additional cost to activate this card, banish three fire element and/or Automaton cards from your graveyard.\n\nTaunt\n\n[Class Bonus] On Death: Deal 3 damage to target champion.",
      abilities: [
        {
          id: "cbNF64gCsS-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to activate this card, banish three fire element and/or Automaton cards from your graveyard.",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "select-and-move",
                player: "controller",
                from: "graveyard",
                to: "banishment",
                count: {
                  kind: "exactly",
                  amount: 3,
                },
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "element",
                      oneOf: ["FIRE"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["AUTOMATON"],
                    },
                  ],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "cbNF64gCsS-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Taunt",
          keyword: {
            name: "taunt",
          },
        },
        {
          id: "cbNF64gCsS-a3",
          kind: "triggered",
          text: "[Class Bonus] On Death: Deal 3 damage to target champion.",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
              subject: {
                kind: "source",
              },
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
      ],
    },
  },
};

export default furnaceDrone;
