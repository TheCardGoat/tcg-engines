import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const glimmeringRefusal: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "fp773yotth",
  slug: "glimmering-refusal",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "fp773yotth:face:default",
      catalogId: "fp773yotth",
      name: "Glimmering Refusal",
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
      rulesText:
        "Negate target card activation unless its controller pays (X), where X is the amount of phantasias you control. Banish the card that had its activation negated this way.",
      abilities: [
        {
          id: "fp773yotth-a1",
          kind: "card-resolution",
          text: "Negate target card activation unless its controller pays (X), where X is the amount of phantasias you control. Banish the card that had its activation negated this way.",
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
              },
            },
          ],
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "count",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["PHANTASIA"],
                  },
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
                  controllerOf: "target-stack-item",
                },
                cost: {
                  kind: "pay-reserve",
                  amount: {
                    kind: "variable",
                    symbol: "X",
                  },
                },
                otherwise: {
                  kind: "negate",
                  subject: {
                    kind: "bound",
                    binding: "target-stack-item",
                  },
                  bindResultAs: "negated-stack-item",
                },
              },
              {
                kind: "banish-object",
                subject: {
                  kind: "stack-source",
                  binding: "negated-stack-item",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default glimmeringRefusal;
