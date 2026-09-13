import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const aqueousArmor: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "t3q2svd53z",
  slug: "aqueous-armor",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "t3q2svd53z:face:default",
      catalogId: "t3q2svd53z",
      name: "Aqueous Armor",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SPELL"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "Ally Link (This object enters the field linked to target ally. If the link is broken, sacrifice this object.)\n\nAt the beginning of your recollection phase, put the top card of your deck into your graveyard.\n\n[Class Bonus] Linked ally gets +2 LIFE.",
      abilities: [
        {
          id: "t3q2svd53z-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ally Link (This object enters the field linked to target ally. If the link is broken, sacrifice this object.)",
          keyword: {
            name: "link",
            target: "ally",
          },
        },
        {
          id: "t3q2svd53z-a2",
          kind: "triggered",
          text: "At the beginning of your recollection phase, put the top card of your deck into your graveyard.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          effect: {
            kind: "mill",
            player: "controller",
            amount: 1,
          },
        },
        {
          id: "t3q2svd53z-a3",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Linked ally gets +2 LIFE.",
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
                property: "life",
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

export default aqueousArmor;
