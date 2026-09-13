import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const razorbladeExecution: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "myvztzk3v8",
  slug: "razorblade-execution",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "myvztzk3v8:face:default",
      catalogId: "myvztzk3v8",
      name: "Razorblade Execution",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "FAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 4,
      },
      rulesText:
        "Imbue 3 (You may reserve all cards revealed as you activate this card. If at least three of them are wind element, this card becomes imbued.)\n\n[Class Bonus] On Kill: If Razorblade Execution is imbued, put a preparation counter on your champion.",
      abilities: [
        {
          id: "myvztzk3v8-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Imbue 3 (You may reserve all cards revealed as you activate this card. If at least three of them are wind element, this card becomes imbued.)",
          keyword: {
            name: "imbue",
            value: 3,
            elementRequirement: "source-elements",
          },
        },
        {
          id: "myvztzk3v8-a2",
          kind: "triggered",
          text: "[Class Bonus] On Kill: If Razorblade Execution is imbued, put a preparation counter on your champion.",
          trigger: {
            kind: "event",
            event: {
              name: "object-killed",
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
            kind: "conditional",
            condition: {
              kind: "activation-state",
              state: "imbued",
            },
            then: {
              kind: "add-counter",
              subject: {
                kind: "champion",
                player: "controller",
              },
              counter: "preparation",
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default razorbladeExecution;
