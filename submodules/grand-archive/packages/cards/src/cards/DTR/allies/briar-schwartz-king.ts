import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const briarSchwartzKing: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "r1zd9ys1qc",
  slug: "briar-schwartz-king",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "r1zd9ys1qc:face:default",
      catalogId: "r1zd9ys1qc",
      name: "Briar, Schwartz King",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "CHESSMAN", "KING", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 0,
        life: 1,
      },
      rulesText: "Hindered, Spellshroud, Stealth\n\nBriar can't wake up.",
      abilities: [
        {
          id: "r1zd9ys1qc-a1",
          kind: "keyword-group",
          text: "Hindered, Spellshroud, Stealth",
          keywords: [
            {
              name: "hindered",
            },
            {
              name: "spellshroud",
            },
            {
              name: "stealth",
            },
          ],
        },
        {
          id: "r1zd9ys1qc-a2",
          kind: "static",
          staticKind: "effects",
          text: "Briar can't wake up.",
          effects: [
            {
              kind: "rule-modification",
              mode: "forbid",
              action: "wake",
              subject: {
                kind: "source",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default briarSchwartzKing;
