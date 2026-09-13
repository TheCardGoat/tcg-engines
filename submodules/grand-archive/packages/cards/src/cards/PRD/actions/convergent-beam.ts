import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const convergentBeam: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "hPwHRfUpN2",
  slug: "convergent-beam",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "hPwHRfUpN2:face:default",
      catalogId: "hPwHRfUpN2",
      name: "Convergent Beam",
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
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Deal 1 damage to target unit. If you control a Fractal object, deal 3 damage to that unit instead.",
      abilities: [
        {
          id: "hPwHRfUpN2-a1",
          kind: "card-resolution",
          text: "Deal 1 damage to target unit. If you control a Fractal object, deal 3 damage to that unit instead.",
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
            kind: "conditional",
            condition: {
              kind: "collection-exists",
              collection: {
                zones: ["field"],
                player: "controller",
                filter: {
                  kind: "subtype",
                  oneOf: ["FRACTAL"],
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
              amount: 3,
            },
            else: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "bound",
                binding: "target-1",
              },
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default convergentBeam;
