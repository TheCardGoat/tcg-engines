import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const chibiBattleOfRedCliffs: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "881gacexpv",
  slug: "chibi-battle-of-red-cliffs",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "881gacexpv:face:default",
      catalogId: "881gacexpv",
      name: "Chibi, Battle of Red Cliffs",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["DOMAIN"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "RIVER"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Players can't declare attacks with allies unless they pay (1) for each attack declaration.",
      abilities: [
        {
          id: "881gacexpv-a1",
          kind: "static",
          staticKind: "effects",
          text: "Players can't declare attacks with allies unless they pay (1) for each attack declaration.",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "attack",
              subject: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  filter: {
                    kind: "type",
                    oneOf: ["ALLY"],
                  },
                },
              },
              cost: {
                kind: "pay-reserve",
                amount: 1,
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

export default chibiBattleOfRedCliffs;
