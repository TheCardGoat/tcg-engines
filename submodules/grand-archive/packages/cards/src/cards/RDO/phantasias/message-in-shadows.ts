import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const messageInShadows: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "RgloaA6YV2",
  slug: "message-in-shadows",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "RgloaA6YV2:face:default",
      catalogId: "RgloaA6YV2",
      name: "Message in Shadows",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SPELL"],
      },
      elements: ["WIND"],
      stats: {},
      rulesText:
        "Ally Link\n\nOn Enter: Glimpse 2.\n\nAs long as linked ally has stealth, it gets +2POWER.",
      abilities: [
        {
          id: "RgloaA6YV2-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ally Link",
          keyword: {
            name: "link",
            target: "ally",
          },
        },
        {
          id: "RgloaA6YV2-a2",
          kind: "triggered",
          text: "On Enter: Glimpse 2.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "keyword-action",
            action: "glimpse",
            amount: 2,
          },
        },
        {
          id: "RgloaA6YV2-a3",
          kind: "static",
          staticKind: "effects",
          text: "As long as linked ally has stealth, it gets +2POWER.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "subject-matches",
                subject: {
                  kind: "linked-object",
                },
                filter: {
                  kind: "has-keyword",
                  keyword: "stealth",
                },
              },
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

export default messageInShadows;
