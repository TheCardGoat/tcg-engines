import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lakereavingChill: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7wX0tZmhYb",
  slug: "lakereaving-chill",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7wX0tZmhYb:face:default",
      catalogId: "7wX0tZmhYb",
      name: "Lakereaving Chill",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "Item or Weapon Link (This object enters the field linked to target item or weapon. If the link is broken, sacrifice this object.)\n\nLinked object loses all abilities, and can't be used for an attack. ",
      abilities: [
        {
          id: "7wX0tZmhYb-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Item or Weapon Link (This object enters the field linked to target item or weapon. If the link is broken, sacrifice this object.)",
          keyword: {
            name: "link",
            target: "item-or-weapon",
          },
        },
        {
          id: "7wX0tZmhYb-a2",
          kind: "static",
          staticKind: "effects",
          text: "Linked object loses all abilities, and can't be used for an attack.",
          executionSource: "linked-object",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "linked-object",
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "remove-abilities",
              },
            },
            {
              kind: "rule-modification",
              mode: "forbid",
              action: "use-for-attack",
              subject: {
                kind: "linked-object",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default lakereavingChill;
