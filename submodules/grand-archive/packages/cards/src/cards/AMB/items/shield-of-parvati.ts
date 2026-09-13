import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const shieldOfParvati: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "labt8hvoww",
  slug: "shield-of-parvati",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "labt8hvoww:face:default",
      catalogId: "labt8hvoww",
      name: "Shield of Parvati",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SHIELD"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Ally Link (This object enters the field linked to target ally. If the link is broken, sacrifice this object.)\n\nIf linked ally would take damage, prevent 2 of that damage and sacrifice Shield of Parvati instead.",
      abilities: [
        {
          id: "labt8hvoww-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ally Link (This object enters the field linked to target ally. If the link is broken, sacrifice this object.)",
          keyword: {
            name: "link",
            target: "ally",
          },
        },
        {
          id: "labt8hvoww-a2",
          kind: "static",
          staticKind: "effects",
          text: "If linked ally would take damage, prevent 2 of that damage and sacrifice Shield of Parvati instead.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "damage-dealt",
                recipient: {
                  kind: "linked-object",
                },
              },
              operation: {
                kind: "prevent",
                amount: 2,
              },
              afterApply: {
                kind: "sacrifice",
                subject: {
                  kind: "source",
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

export default shieldOfParvati;
