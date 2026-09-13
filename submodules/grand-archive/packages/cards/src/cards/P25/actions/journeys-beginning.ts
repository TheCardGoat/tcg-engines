import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const journeysBeginning: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "8ofid087a6",
  slug: "journeys-beginning",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "8ofid087a6:face:default",
      catalogId: "8ofid087a6",
      name: "Journey's Beginning",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SKILL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Draw a card.\n\n[Guo Jia Bonus] Put a quest counter on your champion. (Apply this effect only if your champion is Guo Jia.)",
      abilities: [
        {
          id: "8ofid087a6-a1",
          kind: "card-resolution",
          text: "Draw a card.",
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
        {
          id: "8ofid087a6-a2",
          kind: "card-resolution",
          text: "[Guo Jia Bonus] Put a quest counter on your champion. (Apply this effect only if your champion is Guo Jia.)",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Guo Jia",
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "champion",
              player: "controller",
            },
            counter: {
              named: "quest",
            },
            amount: 1,
          },
        },
      ],
    },
  },
};

export default journeysBeginning;
