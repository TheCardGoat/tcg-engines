import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const aquatechShell: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "QZT9pQQltw",
  slug: "aquatech-shell",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "QZT9pQQltw:face:default",
      catalogId: "QZT9pQQltw",
      name: "AquaTech Shell",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "VELTECH", "ARMOR"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        'Ally Link\n\nLinked ally gets +2LIFE and has "On Attack: Recover 2."\n\n[Class Bonus] Floating Memory',
      abilities: [
        {
          id: "QZT9pQQltw-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ally Link",
          keyword: {
            name: "link",
            target: "ally",
          },
        },
        {
          id: "QZT9pQQltw-a2",
          kind: "static",
          staticKind: "effects",
          text: 'Linked ally gets +2LIFE and has "On Attack: Recover 2."',
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
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "life",
                operation: "add",
                amount: 2,
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
                kind: "grant-ability",
                ability: {
                  id: "granted-19e18t2-a1",
                  kind: "triggered",
                  text: "On Attack: Recover 2.",
                  trigger: {
                    kind: "event",
                    event: {
                      name: "attack-declared",
                      subject: {
                        kind: "source",
                      },
                    },
                  },
                  effect: {
                    kind: "recover",
                    player: "controller",
                    amount: 2,
                  },
                },
              },
            },
          ],
        },
        {
          id: "QZT9pQQltw-a3",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory",
          keyword: {
            name: "floating-memory",
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
      ],
    },
  },
};

export default aquatechShell;
