import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const flaredIridescence: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "t2lW0Q5KJS",
  slug: "flared-iridescence",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "t2lW0Q5KJS:face:default",
      catalogId: "t2lW0Q5KJS",
      name: "Flared Iridescence",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN", "MAGE"],
        subtypes: ["ASSASSIN", "MAGE", "SPELL"],
      },
      elements: ["EXALTED", "FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Deal 4 damage to target unit.\n\n[Merlin Bonus] [Sheen 10+] Ephemerate — (2) \n\n[Merlin Bonus] [Level 5+] Ephemerate — (2) ",
      abilities: [
        {
          id: "t2lW0Q5KJS-a1",
          kind: "card-resolution",
          text: "Deal 4 damage to target unit.",
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
        },
        {
          id: "t2lW0Q5KJS-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Merlin Bonus] [Sheen 10+] Ephemerate — (2)",
          keyword: {
            name: "ephemerate",
            cost: {
              kind: "pay-reserve",
              amount: 2,
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Merlin",
              },
            },
            {
              kind: "static",
              name: "sheen-restriction",
              condition: {
                kind: "mastery-has-counter",
                mastery: "Fractured Memories",
                counter: {
                  named: "sheen",
                },
                minimum: 10,
              },
            },
          ],
        },
        {
          id: "t2lW0Q5KJS-a3",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Merlin Bonus] [Level 5+] Ephemerate — (2)",
          keyword: {
            name: "ephemerate",
            cost: {
              kind: "pay-reserve",
              amount: 2,
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Merlin",
              },
            },
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 5,
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default flaredIridescence;
