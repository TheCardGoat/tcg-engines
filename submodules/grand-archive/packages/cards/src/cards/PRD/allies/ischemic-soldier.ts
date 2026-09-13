import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ischemicSoldier: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Hb9JCa6lM5",
  slug: "ischemic-soldier",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Hb9JCa6lM5:face:default",
      catalogId: "Hb9JCa6lM5",
      name: "Ischemic Soldier",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["EXIA"],
      stats: {
        power: 3,
        life: 4,
      },
      rulesText: "Whenever you sacrifice Ischemic Soldier, draw two cards into your memory.",
      abilities: [
        {
          id: "Hb9JCa6lM5-a1",
          kind: "triggered",
          text: "Whenever you sacrifice Ischemic Soldier, draw two cards into your memory.",
          trigger: {
            kind: "event",
            event: {
              name: "object-sacrificed",
              actor: "controller",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 2,
            to: "memory",
          },
        },
      ],
    },
  },
};

export default ischemicSoldier;
