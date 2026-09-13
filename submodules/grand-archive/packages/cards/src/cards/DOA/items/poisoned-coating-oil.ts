import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const poisonedCoatingOil: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "OofVX5hX8X",
  slug: "poisoned-coating-oil",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "OofVX5hX8X:face:default",
      catalogId: "OofVX5hX8X",
      name: "Poisoned Coating Oil",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Banish Poisoned Coating Oil: Target ally you control with stealth gets +2 POWER until end of turn.",
      abilities: [
        {
          id: "OofVX5hX8X-a1",
          kind: "activated",
          text: "Banish Poisoned Coating Oil: Target ally you control with stealth gets +2 POWER until end of turn.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
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
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "has-keyword",
                      keyword: "stealth",
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "continuous",
            subjects: {
              kind: "bound",
              binding: "target-1",
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
            },
            layer: {
              layer: "E",
              modifies: "stat",
              sublayer: "modifier",
            },
            change: {
              kind: "numeric",
              property: "power",
              operation: "add",
              amount: 2,
            },
          },
        },
      ],
    },
  },
};

export default poisonedCoatingOil;
