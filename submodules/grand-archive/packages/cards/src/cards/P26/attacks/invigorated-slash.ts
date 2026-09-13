import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const invigoratedSlash: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "W1g0hNzXAC",
  slug: "invigorated-slash",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "W1g0hNzXAC:face:default",
      catalogId: "W1g0hNzXAC",
      name: "Invigorated Slash",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
      },
      rulesText:
        "As long as your champion has leveled up this turn, Invigorated Slash gets +2￰ POWER.",
      abilities: [
        {
          id: "W1g0hNzXAC-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as your champion has leveled up this turn, Invigorated Slash gets +2￰ POWER.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "history",
                event: "champion-leveled-up",
                window: "this-turn",
                actor: "controller",
                minimum: 1,
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

export default invigoratedSlash;
