import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const scientificDiscoveries: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "AiijXxCapd",
  slug: "scientific-discoveries",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "AiijXxCapd:face:default",
      catalogId: "AiijXxCapd",
      name: "Scientific Discoveries",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Glimpse 3. Then you may remove two enlighten counters from your champion. If you do, draw a card into your memory.",
      abilities: [
        {
          id: "AiijXxCapd-a1",
          kind: "card-resolution",
          text: "Glimpse 3. Then you may remove two enlighten counters from your champion. If you do, draw a card into your memory.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "keyword-action",
                action: "glimpse",
                amount: 3,
              },
              {
                kind: "optional",
                player: "controller",
                allOrNothing: true,
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "attempt",
                      effect: {
                        kind: "remove-counter",
                        subject: {
                          kind: "champion",
                          player: "controller",
                        },
                        counter: "enlighten",
                        amount: 2,
                        bindResultAs: "removed-counters",
                      },
                      bindSucceededAs: "optional-action-succeeded",
                    },
                    {
                      kind: "conditional",
                      condition: {
                        kind: "effect-succeeded",
                        binding: "optional-action-succeeded",
                      },
                      then: {
                        kind: "draw",
                        player: "controller",
                        amount: 1,
                        to: "memory",
                      },
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

export default scientificDiscoveries;
