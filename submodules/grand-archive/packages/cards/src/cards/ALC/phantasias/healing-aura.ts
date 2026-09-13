import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const healingAura: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ao8bls6g7x",
  slug: "healing-aura",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ao8bls6g7x:face:default",
      catalogId: "ao8bls6g7x",
      name: "Healing Aura",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to activate. (Apply this effect only if your champion's class matches this card's class.)\n\nAt the beginning of your recollection phase, recover 1. (To recover, remove that many damage counters from your champion.)",
      abilities: [
        {
          id: "ao8bls6g7x-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to activate. (Apply this effect only if your champion's class matches this card's class.)",
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
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "ao8bls6g7x-a2",
          kind: "triggered",
          text: "At the beginning of your recollection phase, recover 1. (To recover, remove that many damage counters from your champion.)",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          effect: {
            kind: "recover",
            player: "controller",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default healingAura;
