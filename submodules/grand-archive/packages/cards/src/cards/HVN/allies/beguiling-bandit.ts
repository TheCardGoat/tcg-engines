import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const beguilingBandit: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "jyrqgyj9vn",
  slug: "beguiling-bandit",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "jyrqgyj9vn:face:default",
      catalogId: "jyrqgyj9vn",
      name: "Beguiling Bandit",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN", "WARRIOR"],
        subtypes: ["ASSASSIN", "WARRIOR", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Players can't declare attacks targeting Beguiling Bandit unless they pay (1) for each attack declaration.\n\n[Class Bonus] [Level 2+] Beguiling Bandit gets +1 POWER.",
      abilities: [
        {
          id: "jyrqgyj9vn-a1",
          kind: "static",
          staticKind: "effects",
          text: "Players can't declare attacks targeting Beguiling Bandit unless they pay (1) for each attack declaration.",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "attack",
              subject: {
                kind: "player",
                player: "each-player",
              },
              against: {
                kind: "source",
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
        {
          id: "jyrqgyj9vn-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] [Level 2+] Beguiling Bandit gets +1 POWER.",
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
                amount: 1,
              },
            },
          ],
        },
      ],
    },
  },
};

export default beguilingBandit;
