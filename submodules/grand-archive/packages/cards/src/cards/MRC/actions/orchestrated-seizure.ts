import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const orchestratedSeizure: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "pwscn0esog",
  slug: "orchestrated-seizure",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "pwscn0esog:face:default",
      catalogId: "pwscn0esog",
      name: "Orchestrated Seizure",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SKILL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "Activate this card only during an opponent’s end phase. \n\nDuring your next materialize phase, you may banish cards with floating memory from your opponents’ graveyards to pay for memory costs.",
      abilities: [
        {
          id: "pwscn0esog-a1",
          kind: "static",
          staticKind: "effects",
          text: "Activate this card only during an opponent’s end phase.",
          effects: [
            {
              kind: "rule-modification",
              mode: "require",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "all",
                conditions: [
                  {
                    kind: "phase",
                    phase: "end",
                  },
                  {
                    kind: "turn-player",
                    player: "opponent",
                  },
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "pwscn0esog-a2",
          kind: "card-resolution",
          text: "During your next materialize phase, you may banish cards with floating memory from your opponents’ graveyards to pay for memory costs.",
          effect: {
            kind: "rule-modification",
            mode: "payment-contribution",
            action: "pay-cost",
            subject: {
              kind: "player",
              player: "controller",
            },
            costKind: "memory",
            fromZone: "graveyard",
            paymentOwner: "each-opponent",
            paymentSourceFilter: {
              kind: "has-keyword",
              keyword: "floating-memory",
            },
            contributionBasis: "per-paid-object",
            duration: {
              kind: "until-end-of-next-phase",
              phase: "materialize",
              whose: "controller",
            },
          },
        },
      ],
    },
  },
};

export default orchestratedSeizure;
