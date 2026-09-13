import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fragmentedSpiritOfWind: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "1trn0yetae",
  slug: "fragmented-spirit-of-wind",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "1trn0yetae:face:default",
      catalogId: "1trn0yetae",
      name: "Fragmented Spirit of Wind",
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
      elements: ["WIND"],
      stats: {
        level: 0,
        life: 15,
      },
      rulesText: "On Enter: Glimpse 6. Draw six cards. Then summon a Spirit Shard token.",
      abilities: [
        {
          id: "1trn0yetae-a1",
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

export default fragmentedSpiritOfWind;
