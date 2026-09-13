import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const eternalMagistrate: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "taug52u81v",
  slug: "eternal-magistrate",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "taug52u81v:face:default",
      catalogId: "taug52u81v",
      name: "Eternal Magistrate",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC", "TAMER"],
        subtypes: ["CLERIC", "TAMER", "AUTOMATON"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Imbue 2 (You may reserve all cards revealed as you activate this card. If at least two of them are wind element, this card becomes imbued.)\n\nAs long as Eternal Magistrate is imbued, cards can’t leave your opponents’ material decks unless it’s their materialize phase.",
      abilities: [
        {
          id: "taug52u81v-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Imbue 2 (You may reserve all cards revealed as you activate this card. If at least two of them are wind element, this card becomes imbued.)",
          keyword: {
            name: "imbue",
            value: 2,
            elementRequirement: "source-elements",
          },
        },
        {
          id: "taug52u81v-a2",
          kind: "static",
          staticKind: "effects",
          text: "As long as Eternal Magistrate is imbued, cards can’t leave your opponents’ material decks unless it’s their materialize phase.",
          effects: [
            {
              kind: "rule-modification",
              mode: "forbid",
              action: "move",
              subject: {
                kind: "player",
                player: "each-opponent",
              },
              fromZone: "material-deck",
              condition: {
                kind: "all",
                conditions: [
                  {
                    kind: "activation-state",
                    state: "imbued",
                  },
                  {
                    kind: "not",
                    condition: {
                      kind: "all",
                      conditions: [
                        {
                          kind: "phase",
                          phase: "materialize",
                        },
                        {
                          kind: "turn-player",
                          player: "event-actor",
                        },
                      ],
                    },
                  },
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default eternalMagistrate;
