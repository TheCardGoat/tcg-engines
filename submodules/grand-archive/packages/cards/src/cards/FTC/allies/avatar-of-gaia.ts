import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const avatarOfGaia: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "fqsuo6gb0o",
  slug: "avatar-of-gaia",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "fqsuo6gb0o:face:default",
      catalogId: "fqsuo6gb0o",
      name: "Avatar of Gaia",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "AVATAR"],
      },
      elements: ["TERA"],
      stats: {
        power: 0,
        life: 2,
      },
      rulesText:
        "Ally Link (This object enters the field linked to target ally. If the link is broken, sacrifice this object.)\n\n[Class Bonus] Preserve\n\nLinked ally has taunt and loses pride.",
      abilities: [
        {
          id: "fqsuo6gb0o-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ally Link (This object enters the field linked to target ally. If the link is broken, sacrifice this object.)",
          keyword: {
            name: "link",
            target: "ally",
          },
        },
        {
          id: "fqsuo6gb0o-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Preserve",
          keyword: {
            name: "preserve",
          },
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
        },
        {
          id: "fqsuo6gb0o-a3",
          kind: "static",
          staticKind: "effects",
          text: "Linked ally has taunt and loses pride.",
          executionSource: "linked-object",
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
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "taunt",
                },
              },
            },
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
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "remove-keyword",
                keyword: {
                  name: "pride",
                  anyValue: true,
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default avatarOfGaia;
