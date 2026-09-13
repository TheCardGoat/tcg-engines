import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const shadowResonance: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "10rsagp9m8",
  slug: "shadow-resonance",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "10rsagp9m8:face:default",
      catalogId: "10rsagp9m8",
      name: "Shadow Resonance",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SKILL"],
      },
      elements: ["UMBRA"],
      speed: "fast",
      stats: {},
      rulesText:
        "Recover 2, then draw a card. (To recover, remove that many damage counters from your champion.)\n\n[Tristan Bonus] If your champion has four or more preparation counters on them, summon an Ominous Shadow token.",
      abilities: [
        {
          id: "10rsagp9m8-a1",
          kind: "card-resolution",
          text: "Recover 2, then draw a card. (To recover, remove that many damage counters from your champion.)",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "recover",
                player: "controller",
                amount: 2,
              },
              {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
            ],
          },
        },
        {
          id: "10rsagp9m8-a2",
          kind: "card-resolution",
          text: "[Tristan Bonus] If your champion has four or more preparation counters on them, summon an Ominous Shadow token.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Tristan",
              },
            },
          ],
          effect: {
            kind: "conditional",
            condition: {
              kind: "compare",
              comparison: {
                left: {
                  kind: "counter-count",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  counter: "preparation",
                },
                operator: "gte",
                right: 4,
              },
            },
            then: {
              kind: "summon",
              object: "Ominous Shadow",
              controller: "controller",
              bindResultAs: "summoned-token",
            },
          },
        },
      ],
    },
  },
};

export default shadowResonance;
