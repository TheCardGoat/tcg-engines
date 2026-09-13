import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const alchemistsCauldron: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Bt9xeTum94",
  slug: "alchemists-cauldron",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Bt9xeTum94:face:default",
      catalogId: "Bt9xeTum94",
      name: "Alchemist's Cauldron",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ARTIFACT"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "[Arisanna Bonus] (3), Banish Alchemist's Cauldron: Gather twice. For the rest of the game, ignore the elemental requirements of non-advanced element Potion cards you activate.",
      abilities: [
        {
          id: "Bt9xeTum94-a1",
          kind: "activated",
          text: "[Arisanna Bonus] (3), Banish Alchemist's Cauldron: Gather twice. For the rest of the game, ignore the elemental requirements of non-advanced element Potion cards you activate.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 3,
              },
              {
                kind: "banish-self",
              },
            ],
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Arisanna",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "repeat",
                count: 2,
                effect: {
                  kind: "keyword-action",
                  action: "gather",
                },
              },
              {
                kind: "rule-modification",
                mode: "allow",
                action: "ignore-element-requirement",
                subject: {
                  kind: "player",
                  player: "controller",
                },
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "element-category",
                      value: "non-advanced",
                    },
                    {
                      kind: "subtype",
                      oneOf: ["POTION"],
                    },
                  ],
                },
                duration: {
                  kind: "permanent",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default alchemistsCauldron;
