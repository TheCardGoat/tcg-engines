import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const manaLimiter: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "IC3OU6vCnF",
  slug: "mana-limiter",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "IC3OU6vCnF:face:default",
      catalogId: "IC3OU6vCnF",
      name: "Mana Limiter",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "BAUBLE"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "You can't remove enlighten counters from your champion to pay for costs. \n\nBanish Mana Limiter: Draw a card. Activate this ability only if your champion has six or more enlighten counters on them.",
      abilities: [
        {
          id: "IC3OU6vCnF-a1",
          kind: "static",
          staticKind: "effects",
          text: "You can't remove enlighten counters from your champion to pay for costs.",
          effects: [
            {
              kind: "rule-modification",
              mode: "forbid",
              action: "pay-cost",
              subject: {
                kind: "player",
                player: "controller",
              },
              paymentMethod: {
                kind: "remove-counter",
                counter: "enlighten",
                from: {
                  kind: "champion",
                  player: "controller",
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "IC3OU6vCnF-a2",
          kind: "activated",
          text: "Banish Mana Limiter: Draw a card. Activate this ability only if your champion has six or more enlighten counters on them.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          condition: {
            kind: "compare",
            comparison: {
              left: {
                kind: "counter-count",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: "enlighten",
              },
              operator: "gte",
              right: 6,
            },
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default manaLimiter;
