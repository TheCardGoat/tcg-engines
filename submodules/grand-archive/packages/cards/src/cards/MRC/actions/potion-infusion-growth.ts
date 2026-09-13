import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const potionInfusionGrowth: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "2898b1w1mv",
  slug: "potion-infusion-growth",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "2898b1w1mv:face:default",
      catalogId: "2898b1w1mv",
      name: "Potion Infusion: Growth",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["WIND"],
      speed: "slow",
      stats: {},
      rulesText:
        "Rest target Potion. If you do, put LV age counters on it. (LV refers to your champion’s level.)",
      abilities: [
        {
          id: "2898b1w1mv-a1",
          kind: "card-resolution",
          text: "Rest target Potion. If you do, put LV age counters on it. (LV refers to your champion’s level.)",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "subtype",
                  oneOf: ["POTION"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "attempt",
                effect: {
                  kind: "rest",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
                  },
                },
                bindSucceededAs: "prior-effect-succeeded",
              },
              {
                kind: "conditional",
                condition: {
                  kind: "effect-succeeded",
                  binding: "prior-effect-succeeded",
                },
                then: {
                  kind: "add-counter",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  counter: {
                    named: "age",
                  },
                  amount: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default potionInfusionGrowth;
