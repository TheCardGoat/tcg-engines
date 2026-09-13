import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const regalExpulsion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "OvihPzTqcP",
  slug: "regal-expulsion",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "OvihPzTqcP:face:default",
      catalogId: "OvihPzTqcP",
      name: "Regal Expulsion",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL", "REACTION"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText: "Negate target card activation if that card was activated from a material deck.",
      abilities: [
        {
          id: "OvihPzTqcP-a1",
          kind: "card-resolution",
          text: "Negate target card activation if that card was activated from a material deck.",
          targets: [
            {
              id: "target-stack-item",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "stack-item",
                itemTypes: ["card-activation"],
                activationFrom: ["material-deck"],
              },
            },
          ],
          effect: {
            kind: "negate",
            subject: {
              kind: "bound",
              binding: "target-stack-item",
            },
            bindResultAs: "negated-stack-item",
          },
        },
      ],
    },
  },
};

export default regalExpulsion;
