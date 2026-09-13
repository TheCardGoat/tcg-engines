import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const covenantOfThorns: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "1vt1cn1tzg",
  slug: "covenant-of-thorns",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "1vt1cn1tzg:face:default",
      catalogId: "1vt1cn1tzg",
      name: "Covenant of Thorns",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ACCESSORY"],
      },
      elements: ["TERA"],
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to materialize.\n\nAlly Link (This object enters the field linked to target ally. If the link is broken, sacrifice this object.)\n\nIf damage would be dealt to your champion, that damage is dealt to linked ally instead.",
      abilities: [
        {
          id: "1vt1cn1tzg-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to materialize.",
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
              kind: "rule-modification",
              mode: "modify-cost",
              action: "materialize",
              subject: {
                kind: "source",
              },
              costKind: "memory",
              costOperation: "subtract",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "1vt1cn1tzg-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ally Link (This object enters the field linked to target ally. If the link is broken, sacrifice this object.)",
          keyword: {
            name: "link",
            target: "ally",
          },
        },
        {
          id: "1vt1cn1tzg-a3",
          kind: "static",
          staticKind: "effects",
          text: "If damage would be dealt to your champion, that damage is dealt to linked ally instead.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "damage-dealt",
                recipient: {
                  kind: "event-object",
                  controller: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["CHAMPION"],
                  },
                },
              },
              operation: {
                kind: "redirect",
                recipient: {
                  kind: "linked-object",
                },
              },
              duration: {
                kind: "while-source-on-field",
              },
            },
          ],
        },
      ],
    },
  },
};

export default covenantOfThorns;
