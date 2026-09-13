import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const gildedPyre: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "eAoEELWtHi",
  slug: "gilded-pyre",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "eAoEELWtHi:face:default",
      catalogId: "eAoEELWtHi",
      name: "Gilded Pyre",
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
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Deal 2 damage to target unit. If that unit has a buff counter on it, deal 4 damage to it instead.",
      abilities: [
        {
          id: "eAoEELWtHi-a1",
          kind: "card-resolution",
          text: "Deal 2 damage to target unit. If that unit has a buff counter on it, deal 4 damage to it instead.",
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
              kind: "has-counter",
              subject: {
                kind: "bound",
                binding: "target-1",
              },
              counter: "buff",
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
              amount: 4,
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
              amount: 2,
            },
          },
        },
      ],
    },
  },
};

export default gildedPyre;
