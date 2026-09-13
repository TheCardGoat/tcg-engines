import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const starbirth: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qxu89i1mrk",
  slug: "starbirth",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qxu89i1mrk:face:default",
      catalogId: "qxu89i1mrk",
      name: "Starbirth",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["ASTRA"],
      speed: "slow",
      stats: {},
      rulesText: "Draw a card into your memory. Then summon an Astral Shard token.",
      abilities: [
        {
          id: "qxu89i1mrk-a1",
          kind: "card-resolution",
          text: "Draw a card into your memory. Then summon an Astral Shard token.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 1,
                to: "memory",
              },
              {
                kind: "summon",
                object: "Astral Shard",
                controller: "controller",
                bindResultAs: "summoned-token",
              },
            ],
          },
        },
      ],
    },
  },
};

export default starbirth;
