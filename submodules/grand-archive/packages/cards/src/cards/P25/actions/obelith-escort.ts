import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const obelithEscort: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "3uqgjoBQ9G",
  slug: "obelith-escort",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "3uqgjoBQ9G:face:default",
      catalogId: "3uqgjoBQ9G",
      name: "Obelith Escort",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Prepare 2\n\nSummon a Memorite Obelith token with a sheen counter on it. If Obelith Escort was prepared, summon an additional Memorite Obelith token with a sheen counter on it.",
      abilities: [
        {
          id: "3uqgjoBQ9G-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Prepare 2",
          keyword: {
            name: "prepare",
            value: 2,
          },
        },
        {
          id: "3uqgjoBQ9G-a2",
          kind: "card-resolution",
          text: "Summon a Memorite Obelith token with a sheen counter on it. If Obelith Escort was prepared, summon an additional Memorite Obelith token with a sheen counter on it.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "summon",
                object: "Memorite Obelith",
                controller: "controller",
                bindResultAs: "summoned-token",
                entersWithCounters: [
                  {
                    counter: {
                      named: "sheen",
                    },
                    amount: 1,
                  },
                ],
              },
              {
                kind: "conditional",
                condition: {
                  kind: "activation-state",
                  state: "prepared",
                },
                then: {
                  kind: "summon",
                  object: "additional Memorite Obelith",
                  controller: "controller",
                  bindResultAs: "summoned-token",
                  entersWithCounters: [
                    {
                      counter: {
                        named: "sheen",
                      },
                      amount: 1,
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default obelithEscort;
