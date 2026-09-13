import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const temperInFlames: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "wjzg76zofp",
  slug: "temper-in-flames",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "wjzg76zofp:face:default",
      catalogId: "wjzg76zofp",
      name: "Temper in Flames",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SKILL", "CRAFT"],
      },
      elements: ["FIRE"],
      speed: "slow",
      stats: {},
      rulesText: "Target weapon gets +1 POWER until end of turn. Put a durability counter on it.",
      abilities: [
        {
          id: "wjzg76zofp-a1",
          kind: "card-resolution",
          text: "Target weapon gets +1 POWER until end of turn. Put a durability counter on it.",
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
                  oneOf: ["WEAPON"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "continuous",
                subjects: {
                  kind: "bound",
                  binding: "target-1",
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
                  property: "power",
                  operation: "add",
                  amount: 1,
                },
              },
              {
                kind: "add-counter",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                counter: "durability",
                amount: 1,
              },
            ],
          },
        },
      ],
    },
  },
};

export default temperInFlames;
