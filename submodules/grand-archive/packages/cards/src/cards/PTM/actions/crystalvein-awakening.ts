import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const crystalveinAwakening: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "jH3ZOavGPR",
  slug: "crystalvein-awakening",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "jH3ZOavGPR:face:default",
      catalogId: "jH3ZOavGPR",
      name: "Crystalvein Awakening",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SPELL"],
      },
      elements: ["WIND"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Merlin Bonus] Imbue 2 (You may reserve all cards revealed as you activate this card. If at least two of them are wind element, this card becomes imbued.)\n\nSummon a Memorite Obelith token with a sheen counter on it. If Crystalvein Awakening is imbued, put an additional sheen counter on that token.",
      abilities: [
        {
          id: "jH3ZOavGPR-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Merlin Bonus] Imbue 2 (You may reserve all cards revealed as you activate this card. If at least two of them are wind element, this card becomes imbued.)",
          keyword: {
            name: "imbue",
            value: 2,
            elementRequirement: "source-elements",
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Merlin",
              },
            },
          ],
        },
        {
          id: "jH3ZOavGPR-a2",
          kind: "card-resolution",
          text: "Summon a Memorite Obelith token with a sheen counter on it. If Crystalvein Awakening is imbued, put an additional sheen counter on that token.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "summon",
                controller: "controller",
                object: "Memorite Obelith",
                entersWithCounters: [
                  {
                    counter: {
                      named: "sheen",
                    },
                    amount: 1,
                  },
                ],
                bindResultAs: "summoned-obelith",
              },
              {
                kind: "conditional",
                condition: {
                  kind: "activation-state",
                  state: "imbued",
                },
                then: {
                  kind: "add-counter",
                  subject: {
                    kind: "bound",
                    binding: "summoned-obelith",
                  },
                  counter: {
                    named: "sheen",
                  },
                  amount: 1,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default crystalveinAwakening;
