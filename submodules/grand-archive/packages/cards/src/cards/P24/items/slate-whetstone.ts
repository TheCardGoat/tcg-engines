import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const slateWhetstone: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "a8a0v4njrt",
  slug: "slate-whetstone",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "a8a0v4njrt:face:default",
      catalogId: "a8a0v4njrt",
      name: "Slate Whetstone",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Banish Slate Whetstone: Up to one target Polearm weapon you control gets +1 POWER until end of turn. Draw a card.",
      abilities: [
        {
          id: "a8a0v4njrt-a1",
          kind: "activated",
          text: "Banish Slate Whetstone: Up to one target Polearm weapon you control gets +1 POWER until end of turn. Draw a card.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
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
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["WEAPON"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["POLEARM"],
                    },
                  ],
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
                kind: "draw",
                player: "controller",
                amount: 1,
              },
            ],
          },
        },
      ],
    },
  },
};

export default slateWhetstone;
