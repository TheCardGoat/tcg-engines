import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const materializePolearm: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "zc7wxgur23",
  slug: "materialize-polearm",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "zc7wxgur23:face:default",
      catalogId: "zc7wxgur23",
      name: "Materialize Polearm",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SPELL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to activate. (Apply this effect only if your champion's class matches this card's class.)\n\nMaterialize a Polearm card from your material deck. (You still pay its costs.)",
      abilities: [
        {
          id: "zc7wxgur23-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to activate. (Apply this effect only if your champion's class matches this card's class.)",
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "zc7wxgur23-a2",
          kind: "card-resolution",
          text: "Materialize a Polearm card from your material deck. (You still pay its costs.)",
          effect: {
            kind: "choose",
            selection: {
              id: "materialized-card",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              candidates: {
                kind: "card",
                zones: ["material-deck"],
                relationship: "zone-of",
                player: "controller",
                filter: {
                  kind: "subtype",
                  oneOf: ["POLEARM"],
                },
              },
            },
            effect: {
              kind: "materialize-card",
              subject: {
                kind: "bound",
                binding: "materialized-card",
              },
            },
          },
        },
      ],
    },
  },
};

export default materializePolearm;
