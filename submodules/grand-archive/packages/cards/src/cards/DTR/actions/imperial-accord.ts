import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const imperialAccord: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "1S7Q5fqX5u",
  slug: "imperial-accord",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "1S7Q5fqX5u:face:default",
      catalogId: "1S7Q5fqX5u",
      name: "Imperial Accord",
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
      elements: ["EXALTED", "WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)\n\nNegate target advanced element card activation unless its controller pays (6). You may banish the card that had its activation negated this way.",
      abilities: [
        {
          id: "1S7Q5fqX5u-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)",
          keyword: {
            name: "exalted",
          },
        },
        {
          id: "1S7Q5fqX5u-a2",
          kind: "card-resolution",
          text: "Negate target advanced element card activation unless its controller pays (6). You may banish the card that had its activation negated this way.",
          targets: [
            {
              id: "target-activation",
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
                sourceFilter: {
                  kind: "element-category",
                  value: "advanced",
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "unless-paid",
                player: {
                  controllerOf: "target-activation",
                },
                cost: {
                  kind: "pay-reserve",
                  amount: 6,
                },
                otherwise: {
                  kind: "negate",
                  subject: {
                    kind: "bound",
                    binding: "target-activation",
                  },
                  bindResultAs: "negated-activation",
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "effect-succeeded",
                  binding: "negated-activation",
                },
                then: {
                  kind: "optional",
                  player: "controller",
                  allOrNothing: true,
                  effect: {
                    kind: "banish-object",
                    subject: {
                      kind: "stack-source",
                      binding: "target-activation",
                    },
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

export default imperialAccord;
