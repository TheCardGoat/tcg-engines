import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const gunsmithsArsenal: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "e6mAjsbItw",
  slug: "gunsmiths-arsenal",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "e6mAjsbItw:face:default",
      catalogId: "e6mAjsbItw",
      name: "Gunsmith's Arsenal",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SPELL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 2 less to activate. (Apply this effect only if your champion's class matches this card's class.)\n\nMaterialize a Bullet or Gun card from your material deck. (You still pay its costs.)",
      abilities: [
        {
          id: "e6mAjsbItw-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 2 less to activate. (Apply this effect only if your champion's class matches this card's class.)",
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
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "e6mAjsbItw-a2",
          kind: "card-resolution",
          text: "Materialize a Bullet or Gun card from your material deck. (You still pay its costs.)",
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
                  oneOf: ["GUN"],
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

export default gunsmithsArsenal;
