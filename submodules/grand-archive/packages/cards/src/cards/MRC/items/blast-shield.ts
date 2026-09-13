import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const blastShield: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "eanbrfnrow",
  slug: "blast-shield",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "eanbrfnrow:face:default",
      catalogId: "eanbrfnrow",
      name: "Blast Shield",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SHIELD"],
      },
      elements: ["FIRE"],
      stats: {},
      rulesText:
        "Ally Link (This object enters the field linked to target ally. If the link is broken, sacrifice this object.)\n\nAt the beginning of your recollection phase, deal 2 damage to your champion.\n\n[Class Bonus] Linked ally gets +2 POWER.",
      abilities: [
        {
          id: "eanbrfnrow-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ally Link (This object enters the field linked to target ally. If the link is broken, sacrifice this object.)",
          keyword: {
            name: "link",
            target: "ally",
          },
        },
        {
          id: "eanbrfnrow-a2",
          kind: "triggered",
          text: "At the beginning of your recollection phase, deal 2 damage to your champion.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
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
            amount: 2,
          },
        },
        {
          id: "eanbrfnrow-a3",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Linked ally gets +2 POWER.",
          executionSource: "linked-object",
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

export default blastShield;
