import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const embercryptBurn: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "k2d3ca13yr",
  slug: "embercrypt-burn",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "k2d3ca13yr:face:default",
      catalogId: "k2d3ca13yr",
      name: "Embercrypt Burn",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText: "Banish target card from a graveyard. Then deal 2 damage to each champion.",
      abilities: [
        {
          id: "k2d3ca13yr-a1",
          kind: "card-resolution",
          text: "Banish target card from a graveyard. Then deal 2 damage to each champion.",
          targets: [
            {
              id: "target-card",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "card",
                zones: ["graveyard"],
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "banish-object",
                subject: {
                  kind: "bound",
                  binding: "target-card",
                },
              },
              {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "each",
                  collection: {
                    zones: ["field"],
                    filter: {
                      kind: "type",
                      oneOf: ["CHAMPION"],
                    },
                  },
                },
                amount: 2,
              },
            ],
          },
        },
      ],
    },
  },
};

export default embercryptBurn;
