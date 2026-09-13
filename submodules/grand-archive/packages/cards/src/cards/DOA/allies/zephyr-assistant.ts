import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const zephyrAssistant: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "XZFXOE9sEV",
  slug: "zephyr-assistant",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "XZFXOE9sEV:face:default",
      catalogId: "XZFXOE9sEV",
      name: "Zephyr Assistant",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText:
        "[Class Bonus] On Enter: Put an enlighten counter on your champion.\n\nOn Leave: Put an enlighten counter on your champion. (Trigger this effect when Zephyr Assistant leaves the field.)",
      abilities: [
        {
          id: "XZFXOE9sEV-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Put an enlighten counter on your champion.",
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
            kind: "add-counter",
            subject: {
              kind: "champion",
              player: "controller",
            },
            counter: "enlighten",
            amount: 1,
          },
        },
        {
          id: "XZFXOE9sEV-a2",
          kind: "triggered",
          text: "On Leave: Put an enlighten counter on your champion. (Trigger this effect when Zephyr Assistant leaves the field.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-left-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "add-counter",
            subject: {
              kind: "champion",
              player: "controller",
            },
            counter: "enlighten",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default zephyrAssistant;
