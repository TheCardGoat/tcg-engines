import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const gusttechShield: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "MTm7r2KOSS",
  slug: "gusttech-shield",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "MTm7r2KOSS:face:default",
      catalogId: "MTm7r2KOSS",
      name: "GustTech Shield",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "VELTECH", "SHIELD"],
      },
      elements: ["WIND"],
      stats: {},
      rulesText:
        "Ally Link\n\nLink Shield \n\nLinked ally has vigor. (At the beginning of the end phase, wake up allies with vigor.)",
      abilities: [
        {
          id: "MTm7r2KOSS-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ally Link",
          keyword: {
            name: "link",
            target: "ally",
          },
        },
        {
          id: "MTm7r2KOSS-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Link Shield",
          keyword: {
            name: "link-shield",
          },
        },
        {
          id: "MTm7r2KOSS-a3",
          kind: "static",
          staticKind: "effects",
          text: "Linked ally has vigor. (At the beginning of the end phase, wake up allies with vigor.)",
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
                  name: "vigor",
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default gusttechShield;
