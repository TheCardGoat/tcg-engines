import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const shadowstrike: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "o191zv86la",
  slug: "shadowstrike",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "o191zv86la:face:default",
      catalogId: "o191zv86la",
      name: "Shadowstrike",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "DAGGER"],
      },
      elements: ["UMBRA"],
      stats: {
        power: 4,
      },
      rulesText:
        "Prepare X. X can't be 0.\n\nShadowstrike gets +X POWER.\n\n[Class Bonus] If Shadowstrike was prepared, it has unblockable. (An attack with unblockable can't be intercepted and ignores taunt.)",
      abilities: [
        {
          id: "o191zv86la-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Prepare X. X can't be 0.",
          keyword: {
            name: "prepare",
            value: {
              kind: "variable",
              symbol: "X",
            },
          },
          variables: [
            {
              symbol: "X",
              kind: "chosen",
              minimum: 1,
            },
          ],
        },
        {
          id: "o191zv86la-a2",
          kind: "static",
          staticKind: "effects",
          text: "Shadowstrike gets +X POWER.",
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
                amount: {
                  kind: "variable",
                  symbol: "X",
                },
              },
            },
          ],
        },
        {
          id: "o191zv86la-a3",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] If Shadowstrike was prepared, it has unblockable. (An attack with unblockable can't be intercepted and ignores taunt.)",
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
              condition: {
                kind: "activation-state",
                state: "prepared",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "unblockable",
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default shadowstrike;
