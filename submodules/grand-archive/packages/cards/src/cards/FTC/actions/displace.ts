import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const displace: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "bro89w0ejc",
  slug: "displace",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "bro89w0ejc:face:default",
      catalogId: "bro89w0ejc",
      name: "Displace",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "SPELL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "Banish target ally, then return it to the field under its owner's control rested.\n\n[Class Bonus] Put an enlighten counter on your champion.",
      abilities: [
        {
          id: "bro89w0ejc-a1",
          kind: "card-resolution",
          text: "Banish target ally, then return it to the field under its owner's control rested.",
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
            kind: "sequence",
            effects: [
              {
                kind: "banish-object",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
              },
              {
                kind: "move",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                from: "banishment",
                destination: {
                  zone: "field",
                },
              },
              {
                kind: "set-object-state",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                state: "rested",
                value: true,
              },
            ],
          },
        },
        {
          id: "bro89w0ejc-a2",
          kind: "card-resolution",
          text: "[Class Bonus] Put an enlighten counter on your champion.",
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
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
      ],
    },
  },
};

export default displace;
