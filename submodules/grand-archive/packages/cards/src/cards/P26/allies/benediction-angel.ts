import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const benedictionAngel: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "kl4bTg57Cj",
  slug: "benediction-angel",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "kl4bTg57Cj:face:default",
      catalogId: "kl4bTg57Cj",
      name: "Benediction Angel",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ANGEL"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText:
        "Advanced Imbue 2 (You may reserve all cards revealed as you activate this card. If at least two of them are advanced element, this card becomes imbued.)\n\nOn Enter: If Benediction Angel is imbued, draw a card into your memory and recover 2.",
      abilities: [
        {
          id: "kl4bTg57Cj-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Advanced Imbue 2 (You may reserve all cards revealed as you activate this card. If at least two of them are advanced element, this card becomes imbued.)",
          keyword: {
            name: "imbue",
            value: 2,
            elementRequirement: "advanced",
          },
        },
        {
          id: "kl4bTg57Cj-a2",
          kind: "triggered",
          text: "On Enter: If Benediction Angel is imbued, draw a card into your memory and recover 2.",
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
              kind: "sequence",
              effects: [
                {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                  to: "memory",
                },
                {
                  kind: "recover",
                  player: "controller",
                  amount: 2,
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default benedictionAngel;
