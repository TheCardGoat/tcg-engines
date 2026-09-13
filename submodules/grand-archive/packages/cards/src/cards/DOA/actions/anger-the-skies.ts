import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const angerTheSkies: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "wOKw0q4SZR",
  slug: "anger-the-skies",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "wOKw0q4SZR:face:default",
      catalogId: "wOKw0q4SZR",
      name: "Anger the Skies",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["ARCANE"],
      speed: "slow",
      stats: {},
      rulesText: "Deal 3 damage to all allies. Class Bonus: Deal 4 damage to those allies instead.",
      abilities: [
        {
          id: "wOKw0q4SZR-a1",
          kind: "card-resolution",
          text: "Deal 3 damage to all allies. Class Bonus: Deal 4 damage to those allies instead.",
          effect: {
            kind: "conditional",
            condition: {
              kind: "champion-matches-source",
              characteristic: "class",
            },
            then: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  filter: {
                    kind: "type",
                    oneOf: ["ALLY"],
                  },
                },
              },
              amount: 4,
            },
            else: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  filter: {
                    kind: "type",
                    oneOf: ["ALLY"],
                  },
                },
              },
              amount: 3,
            },
          },
        },
      ],
    },
  },
};

export default angerTheSkies;
