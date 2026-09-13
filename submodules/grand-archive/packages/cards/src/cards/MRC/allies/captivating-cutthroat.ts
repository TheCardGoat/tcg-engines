import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const captivatingCutthroat: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7lh9v2214u",
  slug: "captivating-cutthroat",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7lh9v2214u:face:default",
      catalogId: "7lh9v2214u",
      name: "Captivating Cutthroat",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 1,
      },
      rulesText:
        "[Class Bonus] Captivating Cutthroat gets +1 POWER and has “On Attack: Deal 1 damage to your champion.” (Apply this effect only if your champion’s class matches this card’s class.)",
      abilities: [
        {
          id: "7lh9v2214u-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Captivating Cutthroat gets +1 POWER and has “On Attack: Deal 1 damage to your champion.” (Apply this effect only if your champion’s class matches this card’s class.)",
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
                  id: "granted-1fmifuz-a1",
                  kind: "triggered",
                  text: "On Attack: Deal 1 damage to your champion.",
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
                    kind: "deal-damage",
                    source: {
                      kind: "source",
                    },
                    recipient: {
                      kind: "champion",
                      player: "controller",
                    },
                    amount: 1,
                  },
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default captivatingCutthroat;
