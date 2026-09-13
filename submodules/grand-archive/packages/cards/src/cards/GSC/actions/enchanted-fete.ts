import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const enchantedFete: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "s190ox288c",
  slug: "enchanted-fete",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "s190ox288c:face:default",
      catalogId: "s190ox288c",
      name: "Enchanted Fete",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SKILL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Recover 3 and draw a card into your memory. (To recover, remove that many damage counters from your champion.)",
      abilities: [
        {
          id: "s190ox288c-a1",
          kind: "card-resolution",
          text: "Recover 3 and draw a card into your memory. (To recover, remove that many damage counters from your champion.)",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "recover",
                player: "controller",
                amount: 3,
              },
              {
                kind: "draw",
                player: "controller",
                amount: 1,
                to: "memory",
              },
            ],
          },
        },
      ],
    },
  },
};

export default enchantedFete;
