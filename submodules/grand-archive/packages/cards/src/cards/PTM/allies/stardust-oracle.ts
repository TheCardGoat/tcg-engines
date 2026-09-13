import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const stardustOracle: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "EPy8OUmPxa",
  slug: "stardust-oracle",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "EPy8OUmPxa:face:default",
      catalogId: "EPy8OUmPxa",
      name: "Stardust Oracle",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HUMAN"],
      },
      elements: ["ASTRA"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Imbue 2 (You may reserve all cards revealed as you activate this card. If at least two of them are astra element, this card becomes imbued.)\n\nAs long as Stardust Oracle is imbued, it has stealth.\n\n[Class Bonus] At the beginning of your end phase, summon an Astral Shard token.",
      abilities: [
        {
          id: "EPy8OUmPxa-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Imbue 2 (You may reserve all cards revealed as you activate this card. If at least two of them are astra element, this card becomes imbued.)",
          keyword: {
            name: "imbue",
            value: 2,
            elementRequirement: "source-elements",
          },
        },
        {
          id: "EPy8OUmPxa-a2",
          kind: "static",
          staticKind: "effects",
          text: "As long as Stardust Oracle is imbued, it has stealth.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "activation-state",
                state: "imbued",
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
                  name: "stealth",
                },
              },
            },
          ],
        },
        {
          id: "EPy8OUmPxa-a3",
          kind: "triggered",
          text: "[Class Bonus] At the beginning of your end phase, summon an Astral Shard token.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "end",
              actor: "controller",
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
            kind: "summon",
            object: "Astral Shard",
            controller: "controller",
            bindResultAs: "summoned-token",
          },
        },
      ],
    },
  },
};

export default stardustOracle;
