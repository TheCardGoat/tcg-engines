import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const blazingDirewolf: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "gKVMTAeLXQ",
  slug: "blazing-direwolf",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "gKVMTAeLXQ:face:default",
      catalogId: "gKVMTAeLXQ",
      name: "Blazing Direwolf",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "WOLF"],
      },
      elements: ["FIRE"],
      stats: {
        power: 4,
        life: 4,
      },
      rulesText:
        "Pride 5 (This ally won't obey you unless your champion is level 5 or higher.)\n\n[Class Bonus] On Attack: Deal 2 damage to target unit. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "gKVMTAeLXQ-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Pride 5 (This ally won't obey you unless your champion is level 5 or higher.)",
          keyword: {
            name: "pride",
            value: 5,
          },
        },
        {
          id: "gKVMTAeLXQ-a2",
          kind: "triggered",
          text: "[Class Bonus] On Attack: Deal 2 damage to target unit. (Apply this effect only if your champion's class matches this card's class.)",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
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
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
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
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "bound",
              binding: "target-1",
            },
            amount: 2,
          },
        },
      ],
    },
  },
};

export default blazingDirewolf;
