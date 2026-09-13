import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const bandageWound: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "9q1vk8ao8b",
  slug: "bandage-wound",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "9q1vk8ao8b:face:default",
      catalogId: "9q1vk8ao8b",
      name: "Bandage Wound",
      cost: {
        kind: "reserve",
        amount: 2,
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
      rulesText: "Recover 4. (To recover, remove that many damage counters from your champion.)",
      abilities: [
        {
          id: "9q1vk8ao8b-a1",
          kind: "card-resolution",
          text: "Recover 4. (To recover, remove that many damage counters from your champion.)",
          effect: {
            kind: "recover",
            player: "controller",
            amount: 4,
          },
        },
      ],
    },
  },
};

export default bandageWound;
