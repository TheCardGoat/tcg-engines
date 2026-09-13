import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const undercurrentVantage: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "xicxo661ly",
  slug: "undercurrent-vantage",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "xicxo661ly:face:default",
      catalogId: "xicxo661ly",
      name: "Undercurrent Vantage",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "Glimpse 3. Your champion becomes distant. (Units stay distant until the end of their controller's turn.)\n\n[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "xicxo661ly-a1",
          kind: "card-resolution",
          text: "Glimpse 3. Your champion becomes distant. (Units stay distant until the end of their controller's turn.)",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "keyword-action",
                action: "glimpse",
                amount: 3,
              },
              {
                kind: "set-object-state",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                state: "distant",
                value: true,
              },
            ],
          },
        },
        {
          id: "xicxo661ly-a2",
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

export default undercurrentVantage;
