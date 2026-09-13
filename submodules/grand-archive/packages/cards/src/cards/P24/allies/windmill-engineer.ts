import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const windmillEngineer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "fz1nr5a3pm",
  slug: "windmill-engineer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "fz1nr5a3pm:face:default",
      catalogId: "fz1nr5a3pm",
      name: "Windmill Engineer",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText:
        "Imbue 2 (You may reserve all cards revealed as you activate this card. If at least two of them are wind element, this card becomes imbued.)\n\nOn Enter: If Windmill Engineer is imbued, draw a card into your memory.",
      abilities: [
        {
          id: "fz1nr5a3pm-a1",
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
          id: "fz1nr5a3pm-a2",
          kind: "triggered",
          text: "On Enter: If Windmill Engineer is imbued, draw a card into your memory.",
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
            kind: "conditional",
            condition: {
              kind: "activation-state",
              state: "imbued",
            },
            then: {
              kind: "draw",
              player: "controller",
              amount: 1,
              to: "memory",
            },
          },
        },
      ],
    },
  },
};

export default windmillEngineer;
