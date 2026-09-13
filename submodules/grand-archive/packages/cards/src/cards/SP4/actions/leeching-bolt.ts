import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const leechingBolt: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "hs1mzjzexc",
  slug: "leeching-bolt",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "hs1mzjzexc:face:default",
      catalogId: "hs1mzjzexc",
      name: "Leeching Bolt",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["TERA"],
      speed: "fast",
      stats: {},
      rulesText:
        "Deal LV damage to target unit. Recover 2.\n\n[Class Bonus] If Leeching Bolt is empowered, put it into its owner's material deck preserved. (As you materialize, you may instead return a preserved card your hand.)",
      abilities: [
        {
          id: "hs1mzjzexc-a1",
          kind: "card-resolution",
          text: "Deal LV damage to target unit. Recover 2.",
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
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "bound",
                  binding: "target-1",
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
              {
                kind: "recover",
                player: "controller",
                amount: 2,
              },
            ],
          },
        },
        {
          id: "hs1mzjzexc-a2",
          kind: "card-resolution",
          text: "[Class Bonus] If Leeching Bolt is empowered, put it into its owner's material deck preserved. (As you materialize, you may instead return a preserved card your hand.)",
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
            kind: "conditional",
            condition: {
              kind: "activation-state",
              state: "empowered",
            },
            then: {
              kind: "sequence",
              effects: [
                {
                  kind: "move",
                  subject: {
                    kind: "source",
                  },
                  destination: {
                    zone: "material-deck",
                  },
                },
                {
                  kind: "set-object-state",
                  subject: {
                    kind: "source",
                  },
                  state: "preserved",
                  value: true,
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default leechingBolt;
