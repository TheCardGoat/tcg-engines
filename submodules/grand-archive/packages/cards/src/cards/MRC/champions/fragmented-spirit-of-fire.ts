import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fragmentedSpiritOfFire: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "yvn1uoy5tt",
  slug: "fragmented-spirit-of-fire",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "yvn1uoy5tt:face:default",
      catalogId: "yvn1uoy5tt",
      name: "Fragmented Spirit of Fire",
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
      elements: ["FIRE"],
      stats: {
        level: 0,
        life: 15,
      },
      rulesText: "On Enter: Glimpse 6. Draw six cards. Then summon a Spirit Shard token.",
      abilities: [
        {
          id: "yvn1uoy5tt-a1",
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

export default fragmentedSpiritOfFire;
