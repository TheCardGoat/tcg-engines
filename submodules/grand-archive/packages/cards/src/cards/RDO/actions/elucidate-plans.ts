import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const elucidatePlans: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "GoC1YaaCUV",
  slug: "elucidate-plans",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "GoC1YaaCUV:face:default",
      catalogId: "GoC1YaaCUV",
      name: "Elucidate Plans",
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
      elements: ["LUXEM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Put two preparation counters on your champion.  \n\n[Class Bonus] [Element Bonus] Whenever you reveal this card from your memory, put a preparation counter on your champion.",
      abilities: [
        {
          id: "GoC1YaaCUV-a1",
          kind: "card-resolution",
          text: "Put two preparation counters on your champion.",
          effect: {
            kind: "add-counter",
            subject: {
              kind: "champion",
              player: "controller",
            },
            counter: "preparation",
            amount: 2,
          },
        },
        {
          id: "GoC1YaaCUV-a2",
          kind: "triggered",
          text: "[Class Bonus] [Element Bonus] Whenever you reveal this card from your memory, put a preparation counter on your champion.",
          trigger: {
            kind: "event",
            event: {
              name: "card-revealed",
              actor: "controller",
              from: "memory",
              subject: {
                kind: "source",
              },
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
            {
              kind: "static",
              name: "element-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "element",
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "champion",
              player: "controller",
            },
            counter: "preparation",
            amount: 1,
          },
          functionalZones: ["memory"],
        },
      ],
    },
  },
};

export default elucidatePlans;
