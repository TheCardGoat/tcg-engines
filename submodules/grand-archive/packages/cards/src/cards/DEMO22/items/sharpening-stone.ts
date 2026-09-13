import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sharpeningStone: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "usb5FgKvZX",
  slug: "sharpening-stone",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "usb5FgKvZX:face:default",
      catalogId: "usb5FgKvZX",
      name: "Sharpening Stone",
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
        "Banish Sharpening Stone: Up to one target Dagger or Sword weapon you control gets +1 POWER until end of turn. Draw a card.",
      abilities: [
        {
          id: "usb5FgKvZX-a1",
          kind: "activated",
          text: "Banish Sharpening Stone: Up to one target Dagger or Sword weapon you control gets +1 POWER until end of turn. Draw a card.",
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
                      kind: "any",
                      filters: [
                        {
                          kind: "subtype",
                          oneOf: ["DAGGER"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["SWORD"],
                        },
                      ],
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

export default sharpeningStone;
