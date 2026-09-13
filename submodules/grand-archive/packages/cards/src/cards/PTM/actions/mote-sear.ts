import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const moteSear: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "0G32Pp5atK",
  slug: "mote-sear",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "0G32Pp5atK:face:default",
      catalogId: "0G32Pp5atK",
      name: "Mote Sear",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Deal 2 damage to target unit. Then you may remove two sheen counters from your Fractured Memories. If you do, deal an additional 2 damage to that unit. (The damage is dealt in two separate instances.)",
      abilities: [
        {
          id: "0G32Pp5atK-a1",
          kind: "card-resolution",
          text: "Deal 2 damage to target unit. Then you may remove two sheen counters from your Fractured Memories. If you do, deal an additional 2 damage to that unit. (The damage is dealt in two separate instances.)",
          targets: [
            {
              id: "target-unit",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "bound",
                  binding: "target-unit",
                },
                amount: 2,
              },
              {
                kind: "pay",
                player: "controller",
                cost: {
                  kind: "remove-counter",
                  subject: {
                    kind: "mastery",
                    player: "controller",
                    name: "Fractured Memories",
                  },
                  counter: {
                    named: "sheen",
                  },
                  amount: 2,
                },
                then: {
                  kind: "deal-damage",
                  source: {
                    kind: "source",
                  },
                  recipient: {
                    kind: "bound",
                    binding: "target-unit",
                  },
                  amount: 2,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default moteSear;
