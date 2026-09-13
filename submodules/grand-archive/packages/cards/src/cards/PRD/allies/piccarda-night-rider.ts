import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const piccardaNightRider: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ooGvrzxTmr",
  slug: "piccarda-night-rider",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ooGvrzxTmr:face:default",
      catalogId: "ooGvrzxTmr",
      name: "Piccarda, Night Rider",
      cost: {
        kind: "reserve",
        amount: 7,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["ASSASSIN", "WARRIOR"],
        subtypes: ["ASSASSIN", "WARRIOR", "HUMAN"],
      },
      elements: ["ARCANE"],
      stats: {
        power: 3,
        life: 4,
      },
      rulesText:
        "While paying for this card’s reserve cost, you may remove up to four static counters from among objects you control. Each counter removed this way pays for 1 of that cost.\n\n[Class Bonus] Spellshroud, Stealth\n\nAs long as Piccarda is attacking a champion, she gets +4POWER.",
      abilities: [
        {
          id: "ooGvrzxTmr-a1",
          kind: "static",
          staticKind: "effects",
          text: "While paying for this card’s reserve cost, you may remove up to four static counters from among objects you control. Each counter removed this way pays for 1 of that cost.",
          effects: [
            {
              kind: "rule-modification",
              mode: "payment-contribution",
              action: "pay-cost",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              cost: {
                kind: "select-and-remove-counters",
                player: "controller",
                counter: "static",
                count: {
                  kind: "up-to",
                  amount: 4,
                },
              },
              amount: 1,
              contributionBasis: "per-paid-object",
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "ooGvrzxTmr-a2",
          kind: "keyword-group",
          text: "[Class Bonus] Spellshroud, Stealth",
          keywords: [
            {
              name: "spellshroud",
            },
            {
              name: "stealth",
            },
          ],
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
          id: "ooGvrzxTmr-a3",
          kind: "static",
          staticKind: "effects",
          text: "As long as Piccarda is attacking a champion, she gets +4POWER.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "combat-relation",
                relation: "attacking",
                subject: {
                  kind: "source",
                },
                otherFilter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
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
                amount: 4,
              },
            },
          ],
        },
      ],
    },
  },
};

export default piccardaNightRider;
