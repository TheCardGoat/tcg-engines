import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const jovianHiltXUltra: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "sZTH5LanyW",
  slug: "jovian-hilt-x-ultra",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "sZTH5LanyW:face:default",
      catalogId: "sZTH5LanyW",
      name: "Jovian Hilt X Ultra",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "VELTECH", "ACCESSORY"],
      },
      elements: ["ARCANE"],
      stats: {},
      rulesText:
        "Sword Weapon Link (This object enters the field linked to target Sword weapon. If the link is broken, sacrifice this object.)\n\nOn Enter: Put a durability counter on linked weapon. Then if that weapon has one or more static counters on it, put two static counters on Jovian Hilt X Ultra.\n\nLinked weapon gets +2POWER.",
      abilities: [
        {
          id: "sZTH5LanyW-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Sword Weapon Link (This object enters the field linked to target Sword weapon. If the link is broken, sacrifice this object.)",
          keyword: {
            name: "link",
            target: "sword-weapon",
          },
        },
        {
          id: "sZTH5LanyW-a2",
          kind: "triggered",
          text: "On Enter: Put a durability counter on linked weapon. Then if that weapon has one or more static counters on it, put two static counters on Jovian Hilt X Ultra.",
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
                  oneOf: ["WEAPON"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "add-counter",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                counter: "durability",
                amount: 1,
              },
              {
                kind: "conditional",
                condition: {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "counter-count",
                      subject: {
                        kind: "bound",
                        binding: "target-1",
                      },
                      counter: "static",
                    },
                    operator: "gte",
                    right: 1,
                  },
                },
                then: {
                  kind: "add-counter",
                  subject: {
                    kind: "source",
                  },
                  counter: "static",
                  amount: 2,
                },
              },
            ],
          },
        },
        {
          id: "sZTH5LanyW-a3",
          kind: "static",
          staticKind: "effects",
          text: "Linked weapon gets +2POWER.",
          executionSource: "linked-object",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
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
          ],
        },
      ],
    },
  },
};

export default jovianHiltXUltra;
