import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const disintegrate: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "FhbVHkHQRb",
  slug: "disintegrate",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "FhbVHkHQRb:face:default",
      catalogId: "FhbVHkHQRb",
      name: "Disintegrate",
      cost: {
        kind: "reserve",
        amount: 8,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] Efficiency (This card costs LV less to activate. LV refers to your champion's level. Apply this effect only if your champion's class matches this card's class.)\n\nDestroy target ally or regalia.",
      abilities: [
        {
          id: "FhbVHkHQRb-a1",
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
          id: "FhbVHkHQRb-a2",
          kind: "card-resolution",
          text: "Destroy target ally or regalia.",
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
                  kind: "any",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "supertype",
                      oneOf: ["REGALIA"],
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "destroy",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            bindResultAs: "destroyed-object",
          },
        },
      ],
    },
  },
};

export default disintegrate;
