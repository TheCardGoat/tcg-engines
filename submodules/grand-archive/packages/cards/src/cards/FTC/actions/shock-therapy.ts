import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const shockTherapy: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "tyj2s3572j",
  slug: "shock-therapy",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "tyj2s3572j:face:default",
      catalogId: "tyj2s3572j",
      name: "Shock Therapy",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["ARCANE"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] [Element Bonus] Whenever this card is banished from your memory, put an enlighten counter on your champion.\n\nDeal an amount of damage to target ally equal to the amount of enlighten counters on your champion.",
      abilities: [
        {
          id: "tyj2s3572j-a1",
          kind: "triggered",
          text: "[Class Bonus] [Element Bonus] Whenever this card is banished from your memory, put an enlighten counter on your champion.",
          trigger: {
            kind: "event",
            event: {
              name: "card-banished",
              actor: "controller",
              subject: {
                kind: "source",
              },
              from: "memory",
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
            counter: "enlighten",
            amount: 1,
          },
        },
        {
          id: "tyj2s3572j-a2",
          kind: "card-resolution",
          text: "Deal an amount of damage to target ally equal to the amount of enlighten counters on your champion.",
          targets: [
            {
              id: "target-1",
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
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "bound",
              binding: "target-1",
            },
            amount: {
              kind: "counter-count",
              subject: {
                kind: "champion",
                player: "controller",
              },
              counter: "enlighten",
            },
          },
        },
      ],
    },
  },
};

export default shockTherapy;
