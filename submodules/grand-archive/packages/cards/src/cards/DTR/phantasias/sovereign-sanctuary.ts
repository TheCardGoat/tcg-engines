import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sovereignSanctuary: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "w6OqqsfEso",
  slug: "sovereign-sanctuary",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "w6OqqsfEso:face:default",
      catalogId: "w6OqqsfEso",
      name: "Sovereign Sanctuary",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["EXALTED", "NORM"],
      stats: {},
      rulesText:
        "If a unit you control would be dealt damage, prevent 2 of that damage.\n\nAt the beginning of your recollection phase, sacrifice Sovereign Sanctuary and draw a card into your memory.",
      abilities: [
        {
          id: "w6OqqsfEso-a1",
          kind: "static",
          staticKind: "effects",
          text: "If a unit you control would be dealt damage, prevent 2 of that damage.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "damage-dealt",
                recipient: {
                  kind: "event-object",
                  controller: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["ALLY", "CHAMPION"],
                  },
                },
              },
              operation: {
                kind: "prevent",
                amount: 2,
              },
              duration: {
                kind: "while-source-on-field",
              },
            },
          ],
        },
        {
          id: "w6OqqsfEso-a2",
          kind: "triggered",
          text: "At the beginning of your recollection phase, sacrifice Sovereign Sanctuary and draw a card into your memory.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "sacrifice",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "draw",
                player: "controller",
                amount: 1,
                to: "memory",
              },
            ],
          },
        },
      ],
    },
  },
};

export default sovereignSanctuary;
