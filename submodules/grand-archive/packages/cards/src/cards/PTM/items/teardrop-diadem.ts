import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const teardropDiadem: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "K15jWbHAMY",
  slug: "teardrop-diadem",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "K15jWbHAMY:face:default",
      catalogId: "K15jWbHAMY",
      name: "Teardrop Diadem",
      cost: {
        kind: "memory",
        amount: 3,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ACCESSORY"],
      },
      elements: ["EXALTED", "WATER"],
      stats: {},
      rulesText:
        "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)\n\nPay only using floating memory for this card’s memory cost.\n\nBanish Teardrop Diadem: Draw three cards into your memory.",
      abilities: [
        {
          id: "K15jWbHAMY-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)",
          keyword: {
            name: "exalted",
          },
        },
        {
          id: "K15jWbHAMY-a2",
          kind: "static",
          staticKind: "effects",
          text: "Pay only using floating memory for this card’s memory cost.",
          effects: [
            {
              kind: "rule-modification",
              mode: "require",
              action: "pay-cost",
              subject: {
                kind: "source",
              },
              costKind: "memory",
              paymentSourceFilter: {
                kind: "has-keyword",
                keyword: "floating-memory",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "K15jWbHAMY-a3",
          kind: "activated",
          text: "Banish Teardrop Diadem: Draw three cards into your memory.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 3,
            to: "memory",
          },
        },
      ],
    },
  },
};

export default teardropDiadem;
