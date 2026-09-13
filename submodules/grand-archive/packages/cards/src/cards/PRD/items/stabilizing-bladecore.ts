import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const stabilizingBladecore: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "CbPHWJ8Upd",
  slug: "stabilizing-bladecore",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "CbPHWJ8Upd:face:default",
      catalogId: "CbPHWJ8Upd",
      name: "Stabilizing BladeCore",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "VELTECH", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Sword Weapon Link\n\n[Class Bonus] Linked weapon gets +2POWER.\n\nWhenever your champion levels up, put a durability counter on linked weapon.",
      abilities: [
        {
          id: "CbPHWJ8Upd-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Sword Weapon Link",
          keyword: {
            name: "link",
            target: "sword-weapon",
          },
        },
        {
          id: "CbPHWJ8Upd-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Linked weapon gets +2POWER.",
          executionSource: "linked-object",
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
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
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
                amount: 2,
              },
            },
          ],
        },
        {
          id: "CbPHWJ8Upd-a3",
          kind: "triggered",
          text: "Whenever your champion levels up, put a durability counter on linked weapon.",
          trigger: {
            kind: "event",
            event: {
              name: "champion-leveled-up",
              actor: "controller",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
          },
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
            kind: "add-counter",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            counter: "durability",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default stabilizingBladecore;
