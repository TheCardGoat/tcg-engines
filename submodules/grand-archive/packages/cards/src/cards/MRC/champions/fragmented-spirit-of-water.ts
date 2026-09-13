import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fragmentedSpiritOfWater: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "kat9hreqhj",
  slug: "fragmented-spirit-of-water",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "kat9hreqhj:face:default",
      catalogId: "kat9hreqhj",
      name: "Fragmented Spirit of Water",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["SPIRIT"],
        subtypes: ["SPIRIT"],
      },
      elements: ["WATER"],
      stats: {
        level: 0,
        life: 15,
      },
      rulesText: "On Enter: Glimpse 6. Draw six cards. Then summon a Spirit Shard token.",
      abilities: [
        {
          id: "kat9hreqhj-a1",
          kind: "triggered",
          text: "On Enter: Glimpse 6. Draw six cards. Then summon a Spirit Shard token.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "sequence",
                effects: [
                  {
                    kind: "keyword-action",
                    action: "glimpse",
                    amount: 6,
                  },
                  {
                    kind: "draw",
                    player: "controller",
                    amount: 6,
                  },
                ],
              },
              {
                kind: "summon",
                object: "Spirit Shard",
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

export default fragmentedSpiritOfWater;
