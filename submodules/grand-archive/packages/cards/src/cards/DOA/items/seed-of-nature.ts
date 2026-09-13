import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const seedOfNature: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ybdj1Db9jz",
  slug: "seed-of-nature",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ybdj1Db9jz:face:default",
      catalogId: "ybdj1Db9jz",
      name: "Seed of Nature",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "CRYSTAL"],
      },
      elements: ["TERA"],
      stats: {},
      rulesText:
        "Seed of Nature enters the field rested.\n\nOn Enter: Your champion gets +2 level until end of turn.\n\n[Class Bonus] REST, Banish Seed of Nature: Your champion gets +2 level until end of turn.",
      abilities: [
        {
          id: "ybdj1Db9jz-a1",
          kind: "static",
          staticKind: "effects",
          text: "Seed of Nature enters the field rested.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "object-entered-field",
                subject: {
                  kind: "source",
                },
              },
              operation: {
                kind: "modify-object-state",
                state: "rested",
                value: true,
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "ybdj1Db9jz-a2",
          kind: "triggered",
          text: "On Enter: Your champion gets +2 level until end of turn.",
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
            kind: "continuous",
            subjects: {
              kind: "champion",
              player: "controller",
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
            },
            layer: {
              layer: "E",
              modifies: "stat",
              sublayer: "modifier",
            },
            change: {
              kind: "numeric",
              property: "level",
              operation: "add",
              amount: 2,
            },
          },
        },
        {
          id: "ybdj1Db9jz-a3",
          kind: "activated",
          text: "[Class Bonus] REST, Banish Seed of Nature: Your champion gets +2 level until end of turn.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "banish-self",
              },
            ],
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
          ],
          effect: {
            kind: "continuous",
            subjects: {
              kind: "champion",
              player: "controller",
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
            },
            layer: {
              layer: "E",
              modifies: "stat",
              sublayer: "modifier",
            },
            change: {
              kind: "numeric",
              property: "level",
              operation: "add",
              amount: 2,
            },
          },
        },
      ],
    },
  },
};

export default seedOfNature;
