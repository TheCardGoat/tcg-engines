import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const bloodDragonsPact: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "g23WBQW2Ro",
  slug: "blood-dragons-pact",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "g23WBQW2Ro:face:default",
      catalogId: "g23WBQW2Ro",
      name: "Blood Dragon's Pact",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SPELL"],
      },
      elements: ["EXIA"],
      stats: {},
      rulesText:
        "Ally Link (This object enters the field linked to target ally. If the link is broken, sacrifice this object.)\n\nLinked ally gets +4POWER and +4LIFE.\n\nAt the beginning of your end phase, deal 4 unpreventable damage to your champion.",
      abilities: [
        {
          id: "g23WBQW2Ro-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ally Link (This object enters the field linked to target ally. If the link is broken, sacrifice this object.)",
          keyword: {
            name: "link",
            target: "ally",
          },
        },
        {
          id: "g23WBQW2Ro-a2",
          kind: "static",
          staticKind: "effects",
          text: "Linked ally gets +4POWER and +4LIFE.",
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
                amount: 4,
              },
            },
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
                property: "life",
                operation: "add",
                amount: 4,
              },
            },
          ],
        },
        {
          id: "g23WBQW2Ro-a3",
          kind: "triggered",
          text: "At the beginning of your end phase, deal 4 unpreventable damage to your champion.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "end",
              actor: "controller",
            },
          },
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "champion",
              player: "controller",
            },
            amount: 4,
            preventable: false,
          },
        },
      ],
    },
  },
};

export default bloodDragonsPact;
