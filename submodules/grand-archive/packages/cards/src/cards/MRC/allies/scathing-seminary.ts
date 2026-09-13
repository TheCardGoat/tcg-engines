import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const scathingSeminary: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "aL5pGBcr7i",
  slug: "scathing-seminary",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "aL5pGBcr7i:face:default",
      catalogId: "aL5pGBcr7i",
      name: "Scathing Seminary",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 1,
      },
      rulesText:
        "[Class Bonus] Balance — On Enter: As a Spell, if the amount of cards in your hand and memory are equal, deal 2 unpreventable damage to target unit.",
      abilities: [
        {
          id: "aL5pGBcr7i-a1",
          kind: "triggered",
          text: "[Class Bonus] Balance — On Enter: As a Spell, if the amount of cards in your hand and memory are equal, deal 2 unpreventable damage to target unit.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
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
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "perform-as",
            sourceKind: "spell",
            effect: {
              kind: "conditional",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "count",
                    collection: {
                      zones: ["hand"],
                      player: "controller",
                    },
                  },
                  operator: "eq",
                  right: {
                    kind: "count",
                    collection: {
                      zones: ["memory"],
                      player: "controller",
                    },
                  },
                },
              },
              then: {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "bound",
                  binding: "target-1",
                },
                amount: 2,
                preventable: false,
              },
            },
          },
          label: {
            name: "Balance",
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
      ],
    },
  },
};

export default scathingSeminary;
