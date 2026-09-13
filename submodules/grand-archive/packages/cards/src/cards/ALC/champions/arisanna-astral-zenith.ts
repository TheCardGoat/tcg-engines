import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const arisannaAstralZenith: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "q3huqj5bba",
  slug: "arisanna-astral-zenith",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "q3huqj5bba:face:default",
      catalogId: "q3huqj5bba",
      name: "Arisanna, Astral Zenith",
      lineageName: "Arisanna",
      cost: {
        kind: "memory",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HUMAN"],
      },
      elements: ["ASTRA"],
      stats: {
        level: 3,
        life: 25,
      },
      rulesText:
        "Arisanna Lineage\n\nOnce per turn, you may pay (0) rather than pay a card's starcalling costs.",
      abilities: [
        {
          id: "q3huqj5bba-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Arisanna Lineage",
          keyword: {
            name: "lineage",
            lineageName: "Arisanna",
          },
        },
        {
          id: "q3huqj5bba-a2",
          kind: "static",
          staticKind: "effects",
          text: "Once per turn, you may pay (0) rather than pay a card's starcalling costs.",
          effects: [
            {
              kind: "rule-modification",
              mode: "replace-cost",
              action: "pay-cost",
              subject: {
                kind: "player",
                player: "controller",
              },
              costComponent: "starcalling",
              occurrence: {
                count: 1,
                window: "this-turn",
                actorScope: "same-player",
              },
              cost: {
                kind: "pay-reserve",
                amount: 0,
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

export default arisannaAstralZenith;
