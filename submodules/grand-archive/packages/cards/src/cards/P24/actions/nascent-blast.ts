import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const nascentBlast: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vajycopxgf",
  slug: "nascent-blast",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vajycopxgf:face:default",
      catalogId: "vajycopxgf",
      name: "Nascent Blast",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "SPELL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Deal 3 damage to target unit. If Nascent Blast is empowered, put it into its owner's memory.",
      abilities: [
        {
          id: "vajycopxgf-a1",
          kind: "card-resolution",
          text: "Deal 3 damage to target unit. If Nascent Blast is empowered, put it into its owner's memory.",
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
                amount: 3,
              },
              {
                kind: "conditional",
                condition: {
                  kind: "activation-state",
                  state: "empowered",
                },
                then: {
                  kind: "move",
                  subject: {
                    kind: "source",
                  },
                  destination: {
                    zone: "memory",
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default nascentBlast;
