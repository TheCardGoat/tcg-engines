import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const embersong: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "XMb6pSHFJg",
  slug: "embersong",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "XMb6pSHFJg:face:default",
      catalogId: "XMb6pSHFJg",
      name: "Embersong",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SKILL", "MELODY"],
      },
      elements: ["FIRE"],
      speed: "slow",
      stats: {},
      rulesText:
        "Deal 2 damage to up to one target ally.\n\n[Class Bonus] Target ally you control gets +2 POWER until end of turn. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "XMb6pSHFJg-a1",
          kind: "card-resolution",
          text: "Deal 2 damage to up to one target ally.",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "up-to",
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
            amount: 2,
          },
        },
        {
          id: "XMb6pSHFJg-a2",
          kind: "card-resolution",
          text: "[Class Bonus] Target ally you control gets +2 POWER until end of turn. (Apply this effect only if your champion's class matches this card's class.)",
          targets: [
            {
              id: "XMb6pSHFJg-a2:target-1",
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
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
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
            kind: "continuous",
            subjects: {
              kind: "bound",
              binding: "XMb6pSHFJg-a2:target-1",
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
              amount: 2,
            },
          },
        },
      ],
    },
  },
};

export default embersong;
