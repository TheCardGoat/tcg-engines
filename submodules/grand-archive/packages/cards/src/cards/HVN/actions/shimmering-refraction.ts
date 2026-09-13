import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const shimmeringRefraction: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "1k2jb8mau1",
  slug: "shimmering-refraction",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "1k2jb8mau1:face:default",
      catalogId: "1k2jb8mau1",
      name: "Shimmering Refraction",
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
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Deal X damage to target unit, where X is the amount of phantasias you control. \n\n[Diao Chan Bonus] If Shimmering Refraction was activated from your memory, draw a card into your memory.",
      abilities: [
        {
          id: "1k2jb8mau1-a1",
          kind: "card-resolution",
          text: "Deal X damage to target unit, where X is the amount of phantasias you control.",
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
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "bound",
              binding: "target-1",
            },
            amount: {
              kind: "variable",
              symbol: "X",
            },
          },
        },
        {
          id: "1k2jb8mau1-a2",
          kind: "card-resolution",
          text: "[Diao Chan Bonus] If Shimmering Refraction was activated from your memory, draw a card into your memory.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Diao Chan",
              },
            },
          ],
          effect: {
            kind: "conditional",
            condition: {
              kind: "source-activation-context",
              from: "memory",
            },
            then: {
              kind: "draw",
              player: "controller",
              amount: 1,
              to: "memory",
            },
          },
        },
      ],
    },
  },
};

export default shimmeringRefraction;
