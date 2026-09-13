import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const rapidReload: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ypwc8tuhuy",
  slug: "rapid-reload",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ypwc8tuhuy:face:default",
      catalogId: "ypwc8tuhuy",
      name: "Rapid Reload",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] Efficiency (This card costs LV less to activate. LV refers to your champion's level. Apply this effect only if your champion's class matches this card's class.)\n\nMaterialize a Bullet card from your material deck.",
      abilities: [
        {
          id: "ypwc8tuhuy-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Efficiency (This card costs LV less to activate. LV refers to your champion's level. Apply this effect only if your champion's class matches this card's class.)",
          keyword: {
            name: "efficiency",
          },
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
        },
        {
          id: "ypwc8tuhuy-a2",
          kind: "card-resolution",
          text: "Materialize a Bullet card from your material deck.",
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
                  oneOf: ["BULLET"],
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

export default rapidReload;
