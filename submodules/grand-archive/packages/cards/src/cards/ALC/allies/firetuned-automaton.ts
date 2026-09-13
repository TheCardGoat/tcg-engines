import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const firetunedAutomaton: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "lzjmwuir99",
  slug: "firetuned-automaton",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "lzjmwuir99:face:default",
      catalogId: "lzjmwuir99",
      name: "Firetuned Automaton",
      cost: {
        kind: "reserve",
        amount: 2,
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
        life: 1,
      },
      rulesText:
        "As an additional cost to activate this card, discard a fire element card.\n\n[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "lzjmwuir99-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to activate this card, discard a fire element card.",
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
                from: "hand",
                to: "graveyard",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                filter: {
                  kind: "element",
                  oneOf: ["FIRE"],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "lzjmwuir99-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
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
        },
      ],
    },
  },
};

export default firetunedAutomaton;
