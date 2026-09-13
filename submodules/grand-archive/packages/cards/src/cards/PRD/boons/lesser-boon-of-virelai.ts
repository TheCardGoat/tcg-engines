import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lesserBoonOfVirelai: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "RWJ0fztQK2",
  slug: "lesser-boon-of-virelai",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "RWJ0fztQK2:face:default",
      catalogId: "RWJ0fztQK2",
      name: "Lesser Boon of Virelai",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["LESSER BOON"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText: "As you gain this boon, scavenge 10 for a Harmony or Melody card. ",
      abilities: [
        {
          id: "RWJ0fztQK2-a1",
          kind: "triggered",
          text: "As you gain this boon, scavenge 10 for a Harmony or Melody card.",
          trigger: {
            kind: "event",
            event: {
              name: "boon-gained",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "keyword-action",
            action: "scavenge",
            amount: 10,
            filter: {
              kind: "subtype",
              oneOf: ["HARMONY", "MELODY"],
            },
          },
        },
      ],
    },
  },
};

export default lesserBoonOfVirelai;
