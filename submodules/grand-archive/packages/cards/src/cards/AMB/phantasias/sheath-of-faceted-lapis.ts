import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sheathOfFacetedLapis: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "0cnn1eh85y",
  slug: "sheath-of-faceted-lapis",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "0cnn1eh85y:face:default",
      catalogId: "0cnn1eh85y",
      name: "Sheath of Faceted Lapis",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SPELL"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "Warrior Weapon Link (This object enters the field linked to target Warrior weapon. If the link is broken, sacrifice this object.)\n\nOn Enter: Draw a card.\n\n[Class Bonus] [Level 2+] Linked weapon gets +2 POWER. ",
      abilities: [
        {
          id: "0cnn1eh85y-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Warrior Weapon Link (This object enters the field linked to target Warrior weapon. If the link is broken, sacrifice this object.)",
          keyword: {
            name: "link",
            target: "warrior-weapon",
          },
        },
        {
          id: "0cnn1eh85y-a2",
          kind: "triggered",
          text: "On Enter: Draw a card.",
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
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
        {
          id: "0cnn1eh85y-a3",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] [Level 2+] Linked weapon gets +2 POWER.",
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
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 2,
                },
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
      ],
    },
  },
};

export default sheathOfFacetedLapis;
