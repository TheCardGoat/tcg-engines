import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cloudstoneOrb: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ygqehvpblj",
  slug: "cloudstone-orb",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ygqehvpblj:face:default",
      catalogId: "ygqehvpblj",
      name: "Cloudstone Orb",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "BAUBLE"],
      },
      elements: ["WIND"],
      stats: {},
      rulesText:
        "On Enter: Empower X, where X is the amount of wind element non-champion objects you control.\n\n[Class Bonus] (3): Return Cloudstone Orb to its owner's material deck. (Activate this ability only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "ygqehvpblj-a1",
          kind: "triggered",
          text: "On Enter: Empower X, where X is the amount of wind element non-champion objects you control.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
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
                    kind: "all",
                    filters: [
                      {
                        kind: "element",
                        oneOf: ["WIND"],
                      },
                      {
                        kind: "not",
                        filter: {
                          kind: "type",
                          oneOf: ["CHAMPION"],
                        },
                      },
                    ],
                  },
                },
              },
            },
          ],
          effect: {
            kind: "keyword-action",
            action: "empower",
            amount: {
              kind: "variable",
              symbol: "X",
            },
          },
        },
        {
          id: "ygqehvpblj-a2",
          kind: "activated",
          text: "[Class Bonus] (3): Return Cloudstone Orb to its owner's material deck. (Activate this ability only if your champion's class matches this card's class.)",
          activation: "ability",
          cost: {
            kind: "pay-reserve",
            amount: 3,
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
          effect: {
            kind: "move",
            subject: {
              kind: "source",
            },
            destination: {
              zone: "material-deck",
            },
          },
        },
      ],
    },
  },
};

export default cloudstoneOrb;
