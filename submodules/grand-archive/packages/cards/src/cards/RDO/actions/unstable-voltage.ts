import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const unstableVoltage: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "hiN2g99FLF",
  slug: "unstable-voltage",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "hiN2g99FLF:face:default",
      catalogId: "hiN2g99FLF",
      name: "Unstable Voltage",
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
      elements: ["ARCANE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Deal D6+D6 damage to target ally. (Roll a six-sided die to determine each instance of D6 as this effect resolves.)",
      abilities: [
        {
          id: "hiN2g99FLF-a1",
          kind: "card-resolution",
          text: "Deal D6+D6 damage to target ally. (Roll a six-sided die to determine each instance of D6 as this effect resolves.)",
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
                  oneOf: ["ALLY"],
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
              kind: "calculate",
              operator: "add",
              operands: [
                {
                  kind: "die",
                  sides: 6,
                },
                {
                  kind: "die",
                  sides: 6,
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default unstableVoltage;
