import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const effluveGuard: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5tz8bwcoel",
  slug: "effluve-guard",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5tz8bwcoel:face:default",
      catalogId: "5tz8bwcoel",
      name: "Effluve Guard",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "[Ciel Bonus] As long as this card is an omen, allies named Vacuous Servants you control have vigor. (Apply this effect only if your champion is Ciel.)",
      abilities: [
        {
          id: "5tz8bwcoel-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Ciel Bonus] As long as this card is an omen, allies named Vacuous Servants you control have vigor. (Apply this effect only if your champion is Ciel.)",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Ciel",
              },
            },
          ],
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "name",
                        value: "Vacuous Servants",
                      },
                    ],
                  },
                },
              },
              affectedSet: "dynamic",
              condition: {
                kind: "all",
                conditions: [
                  {
                    kind: "source-zone",
                    zone: "banishment",
                  },
                  {
                    kind: "has-counter",
                    subject: {
                      kind: "source",
                    },
                    counter: "omen",
                  },
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "vigor",
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default effluveGuard;
