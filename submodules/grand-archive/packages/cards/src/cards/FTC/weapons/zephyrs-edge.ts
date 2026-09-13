import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const zephyrsEdge: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "i6eifnz0fg",
  slug: "zephyrs-edge",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "i6eifnz0fg:face:default",
      catalogId: "i6eifnz0fg",
      name: "Zephyr's Edge",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        durability: 2,
      },
      rulesText:
        "[Class Bonus] On Enter: If it's not your materialize phase, Zephyr's Edge gets +1 POWER until end of turn.",
      abilities: [
        {
          id: "i6eifnz0fg-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: If it's not your materialize phase, Zephyr's Edge gets +1 POWER until end of turn.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
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
          effect: {
            kind: "conditional",
            condition: {
              kind: "not",
              condition: {
                kind: "phase",
                phase: "materialize",
              },
            },
            then: {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "locked",
              duration: {
                kind: "this-turn",
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
                amount: 1,
              },
            },
          },
        },
      ],
    },
  },
};

export default zephyrsEdge;
